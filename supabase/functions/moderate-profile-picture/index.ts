import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

type ModerationReason = "nudity" | "offensive_content" | "weapon" | "gore";

export default {
    fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req) => {
        if (req.method === "OPTIONS") {
            return new Response("ok", { headers: corsHeaders });
        }

        if (req.method !== "POST") {
            return Response.json(
                { error: "Méthode non autorisée." },
                { status: 405, headers: corsHeaders },
            );
        }

        try {
            const formData = await req.formData();
            const image = formData.get("image");

            if (!(image instanceof File)) {
                return Response.json(
                    { error: "Le champ image est requis." },
                    { status: 400, headers: corsHeaders },
                );
            }

            if (!image.type.startsWith("image/")) {
                return Response.json(
                    { error: "Le fichier doit être une image." },
                    { status: 400, headers: corsHeaders },
                );
            }

            // 8 Mo : à adapter si besoin selon tes règles d'upload
            if (image.size > 8 * 1024 * 1024) {
                return Response.json(
                    { error: "L'image ne doit pas dépasser 8 Mo." },
                    { status: 400, headers: corsHeaders },
                );
            }

            const sightengineFormData = new FormData();
            sightengineFormData.append("media", image, image.name);
            sightengineFormData.append(
                "models",
                "nudity-2.1,offensive,weapon,gore",
            );
            sightengineFormData.append(
                "api_user",
                Deno.env.get("SIGHTENGINE_API_USER") ?? "",
            );
            sightengineFormData.append(
                "api_secret",
                Deno.env.get("SIGHTENGINE_API_SECRET") ?? "",
            );

            const sightengineResponse = await fetch(
                "https://api.sightengine.com/1.0/check.json",
                {
                    method: "POST",
                    body: sightengineFormData,
                },
            );

            const result = await sightengineResponse.json();

            // console.log(
            //   "Scores Sightengine :",
            //   JSON.stringify(
            //     {
            //       nudity: result.nudity,
            //       offensive: result.offensive,
            //       weapon: result.weapon,
            //       gore: result.gore,
            //     },
            //     null,
            //     2
            //   )
            // );

            if (!sightengineResponse.ok || result.status !== "success") {
                console.error("Erreur Sightengine :", result);

                return Response.json(
                    { error: "La vérification de la photo a échoué." },
                    { status: 502, headers: corsHeaders },
                );
            }

            const nudityScore = Math.max(
                result.nudity?.sexual_activity ?? 0,
                result.nudity?.sexual_display ?? 0,
                result.nudity?.erotica ?? 0,
            );

            const weaponScore = Math.max(
                result.weapon?.classes?.firearm ?? 0,
                result.weapon?.classes?.firearm_gesture ?? 0,
                result.weapon?.classes?.firearm_toy ?? 0,
                result.weapon?.classes?.knife ?? 0,
            );

            let reason: ModerationReason | null = null;

            if (nudityScore > 0.6) {
                reason = "nudity";
            } else if ((result.offensive?.prob ?? 0) > 0.7) {
                reason = "offensive_content";
            } else if (weaponScore > 0.7) {
                reason = "weapon";
            } else if ((result.gore?.prob ?? 0) > 0.7) {
                reason = "gore";
            }

            return Response.json(
                {
                    allowed: reason === null,
                    reason,
                },
                { status: 200, headers: corsHeaders },
            );
        } catch (error) {
            console.error("Erreur de modération :", error);

            return Response.json(
                { error: "Une erreur est survenue lors de la vérification." },
                { status: 500, headers: corsHeaders },
            );
        }
    }),
};