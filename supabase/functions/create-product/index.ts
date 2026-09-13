import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const PRODUCT_CREATION_SERVICE_KEY = Deno.env.get("PRODUCT_CREATION_SERVICE_KEY");

const SIGHTENGINE_API_USER = Deno.env.get("SIGHTENGINE_API_USER");
const SIGHTENGINE_API_SECRET = Deno.env.get("SIGHTENGINE_API_SECRET");
const SIGHTENGINE_MODELS =
    Deno.env.get("SIGHTENGINE_MODELS") ??
    "nudity-2.1,wad,offensive,gore";

const SIGHTENGINE_TIMEOUT_MS = Number(
    Deno.env.get("SIGHTENGINE_TIMEOUT_MS") ?? "15000"
);

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES = 10;
const BUCKET = "product-images";

if (!SUPABASE_URL) throw new Error("SUPABASE_URL is required");
if (!PRODUCT_CREATION_SERVICE_KEY) throw new Error("PRODUCT_CREATION_SERVICE_KEY is required");
if (!SIGHTENGINE_API_USER) {
    throw new Error("SIGHTENGINE_API_USER is required");
}
if (!SIGHTENGINE_API_SECRET) {
    throw new Error("SIGHTENGINE_API_SECRET is required");
}

const admin = createClient(
    SUPABASE_URL,
    PRODUCT_CREATION_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
    }
}

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
        },
    });
}

function requireString(
    value: unknown,
    name: string,
    max: number
): string {
    if (
        typeof value !== "string" ||
        value.trim() === "" ||
        value.length > max
    ) {
        throw new ApiError(400, `${name} is invalid`);
    }

    return value.trim();
}

function requireInteger(
    value: unknown,
    name: string
): number {
    if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        !Number.isSafeInteger(value)
    ) {
        throw new ApiError(400, `${name} must be an integer`);
    }

    return value;
}

function requireCoordinate(
    value: unknown,
    name: string,
    min: number,
    max: number
): number {
    if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < min ||
        value > max
    ) {
        throw new ApiError(400, `${name} is invalid`);
    }

    return value;
}

function jpegMagic(bytes: Uint8Array): boolean {
    return (
        bytes.length >= 3 &&
        bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff
    );
}

function numberAt(
    object: unknown,
    path: string[]
): number | undefined {
    let current: unknown = object;

    for (const key of path) {
        if (!current || typeof current !== "object") {
            return undefined;
        }

        current = (current as Record<string, unknown>)[key];
    }

    return typeof current === "number" &&
        Number.isFinite(current)
        ? current
        : undefined;
}

function rejectSightengineResult(
    result: Record<string, unknown>
): string | null {
    const checks: Array<[string[], number, string]> = [
        [["nudity", "sexual_activity"], 0.2, "sexual activity"],
        [["nudity", "sexual_display"], 0.2, "sexual display"],
        [["nudity", "erotica"], 0.2, "erotica"],
        [["wad", "prob"], 0.5, "weapons or drugs"],
        [["offensive", "prob"], 0.5, "offensive content"],
        [["gore", "prob"], 0.5, "gore"],
    ];

    for (const [path, limit, label] of checks) {
        const score = numberAt(result, path);

        if (score !== undefined && score >= limit) {
            return label;
        }
    }

    return null;
}

async function sightengineCheck(
    file: File,
    bytes: Uint8Array
): Promise<void> {
    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        SIGHTENGINE_TIMEOUT_MS
    );

    try {
        const form = new FormData();

        form.append("api_user", SIGHTENGINE_API_USER!);
        form.append("api_secret", SIGHTENGINE_API_SECRET!);
        form.append("models", SIGHTENGINE_MODELS);
        form.append(
            "media",
            new Blob([bytes], { type: "image/jpeg" }),
            file.name || "image.jpg"
        );

        const response = await fetch(
            "https://api.sightengine.com/1.0/check.json",
            {
                method: "POST",
                body: form,
                signal: controller.signal,
            }
        );

        if (!response.ok) {
            throw new ApiError(
                502,
                "Sightengine is unavailable"
            );
        }

        const result =
            await response.json() as Record<string, unknown>;

        if (result.status !== "success") {
            throw new ApiError(
                502,
                "Sightengine is unavailable"
            );
        }

        const reason = rejectSightengineResult(result);

        if (reason) {
            throw new ApiError(
                422,
                `Image rejected: ${reason}`
            );
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            502,
            "Sightengine is unavailable"
        );
    } finally {
        clearTimeout(timeout);
    }
}

function parsePayload(
    value: FormDataEntryValue | null
): Record<string, unknown> {
    if (typeof value !== "string") {
        throw new ApiError(
            400,
            "payload must be a JSON string"
        );
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(value);
    } catch {
        throw new ApiError(
            400,
            "payload must contain valid JSON"
        );
    }

    if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
    ) {
        throw new ApiError(
            400,
            "payload must be a JSON object"
        );
    }

    return parsed as Record<string, unknown>;
}

function parseAttributes(
    value: unknown
): Array<{
    attributeId: number;
    values: string[];
}> {
    if (!Array.isArray(value)) {
        throw new ApiError(
            400,
            "attributes must be an array"
        );
    }

    return value.map((item, index) => {
        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {
            throw new ApiError(
                400,
                `attributes[${index}] is invalid`
            );
        }

        const row = item as Record<string, unknown>;

        const attributeId = requireInteger(
            row.attributeId,
            `attributes[${index}].attributeId`
        );

        if (
            !Array.isArray(row.values) ||
            row.values.length === 0 ||
            row.values.some(
                (value) => typeof value !== "string"
            )
        ) {
            throw new ApiError(
                400,
                `attributes[${index}].values is invalid`
            );
        }

        return {
            attributeId,
            values: row.values as string[],
        };
    });
}

async function removeUploaded(
    paths: string[]
): Promise<void> {
    if (paths.length === 0) return;

    const { error } = await admin
        .storage
        .from(BUCKET)
        .remove(paths);

    if (error) {
        console.error(
            "Storage cleanup failed",
            {
                paths,
                error: error.message,
            }
        );
    }
}

Deno.serve(async (request: Request) => {
    if (request.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    if (request.method !== "POST") {
        return json(
            { error: "Method not allowed" },
            405
        );
    }

    let uploadedPaths: string[] = [];

    try {
        const authorization =
            request.headers.get("authorization");

        if (
            !authorization ||
            !authorization
                .toLowerCase()
                .startsWith("bearer ")
        ) {
            throw new ApiError(
                401,
                "Missing bearer token"
            );
        }

        const userToken = authorization
            .slice(7)
            .trim();

        if (!userToken) {
            throw new ApiError(
                401,
                "Invalid bearer token"
            );
        }

        const {
            data: { user },
            error: userError,
        } = await admin.auth.getUser(userToken);

        if (userError || !user) {
            throw new ApiError(
                401,
                "Invalid or expired JWT"
            );
        }

        const contentType =
            request.headers.get("content-type") ?? "";

        if (
            !contentType
                .toLowerCase()
                .startsWith("multipart/form-data")
        ) {
            throw new ApiError(
                415,
                "Content-Type must be multipart/form-data"
            );
        }

        const form = await request.formData();

        const payload = parsePayload(
            form.get("payload")
        );

        const files = form
            .getAll("images")
            .filter(
                (entry): entry is File =>
                    entry instanceof File
            );

        if (
            files.length < 1 ||
            files.length > MAX_IMAGES
        ) {
            throw new ApiError(
                400,
                "Between 1 and 10 JPEG images are required"
            );
        }

        if (
            form.getAll("images").length !== files.length
        ) {
            throw new ApiError(
                400,
                "Each images field must be a file"
            );
        }

        const title = requireString(
            payload.title ?? payload.name,
            "title",
            120
        );

        const description = requireString(
            payload.description,
            "description",
            5000
        );

        const categoryId = requireInteger(
            payload.categoryId ?? payload.id_category,
            "categoryId"
        );

        const stateId = requireInteger(
            payload.stateId ?? payload.id_state,
            "stateId"
        );

        if (
            !payload.location ||
            typeof payload.location !== "object" ||
            Array.isArray(payload.location)
        ) {
            throw new ApiError(
                400,
                "location must be an object"
            );
        }

        const location =
            payload.location as Record<string, unknown>;

        const city = requireString(
            location.city,
            "city",
            120
        );

        const postcode = requireString(
            location.postcode ?? location.postalCode,
            "postcode",
            20
        );

        const department = requireString(
            location.department,
            "department",
            120
        );

        const latitude = requireCoordinate(
            location.latitude,
            "latitude",
            -90,
            90
        );

        const longitude = requireCoordinate(
            location.longitude,
            "longitude",
            -180,
            180
        );

        const attributes = parseAttributes(
            payload.attributes
        );

        const imageBytes: Uint8Array[] = [];

        for (const [index, file] of files.entries()) {
            if (
                file.type !== "image/jpeg" ||
                file.size <= 0 ||
                file.size > MAX_IMAGE_BYTES
            ) {
                throw new ApiError(
                    400,
                    `Image ${index + 1} must be a JPEG no larger than 8 MiB`
                );
            }

            const bytes =
                new Uint8Array(await file.arrayBuffer());

            if (!jpegMagic(bytes)) {
                throw new ApiError(
                    400,
                    `Image ${index + 1} is not a valid JPEG`
                );
            }

            imageBytes.push(bytes);
        }

        // Modération avant le premier upload Storage.
        for (const [index, file] of files.entries()) {
            await sightengineCheck(
                file,
                imageBytes[index]
            );
        }

        const uploadUuid = crypto.randomUUID();

        const photos: Array<{
            path: string;
            position: number;
        }> = [];

        for (const [index, bytes] of imageBytes.entries()) {
            const path =
                `products/${user.id}/${uploadUuid}/${index + 1}.jpg`;

            const { error } = await admin
                .storage
                .from(BUCKET)
                .upload(path, bytes, {
                    contentType: "image/jpeg",
                    cacheControl: "31536000",
                    upsert: false,
                });

            if (error) {
                throw new ApiError(
                    502,
                    "Image upload failed"
                );
            }

            uploadedPaths.push(path);

            photos.push({
                path,
                position: index + 1,
            });
        }

        const {
            data: productId,
            error: transactionError,
        } = await admin.rpc(
            "create_product_transaction",
            {
                p_owner_id: user.id,
                p_name: title,
                p_description: description,
                p_category_id: categoryId,
                p_state_id: stateId,
                p_city: city,
                p_postcode: postcode,
                p_department: department,
                p_latitude: latitude,
                p_longitude: longitude,
                p_attributes: attributes,
                p_photos: photos,
            }
        );

        if (
            transactionError ||
            typeof productId !== "number"
        ) {
            await removeUploaded(uploadedPaths);
            uploadedPaths = [];

            throw new ApiError(
                500,
                "Product transaction failed; uploaded images were removed"
            );
        }

        return json({
            productId: String(productId),
        });
    } catch (error) {
        if (uploadedPaths.length > 0) {
            await removeUploaded(uploadedPaths);
        }

        if (error instanceof ApiError) {
            return json(
                { error: error.message },
                error.status
            );
        }

        console.error(
            "create-product failed",
            error
        );

        return json(
            { error: "Unexpected error" },
            500
        );
    }
});