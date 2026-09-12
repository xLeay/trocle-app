import {
    getProductAttributes,
    getProductById,
    getProductPublicLocation,
    getProductsByUsername
} from "@/src/lib/api/product";
import { useQuery } from "@tanstack/react-query";

export const useProductsByUsername = (
    username: string
) => {
    return useQuery({
        queryKey: ['products-by-username', username],
        queryFn: () => getProductsByUsername(username),
        enabled: Boolean(username),
    })
}

export const useProductById = (
    productId: string
) => {
    return useQuery({
        queryKey: ['product-by-id', productId],
        queryFn: () => getProductById(productId),
        enabled: Boolean(productId),
    })
}

export const useProductAttributes = (
    productId: string
) => {
    return useQuery({
        queryKey: ['product-attributes', productId],
        queryFn: () => getProductAttributes(productId),
        enabled: Boolean(productId),
    })
}

export const useProductPublicLocation = (
    productId: string
) => {
    return useQuery({
        queryKey: ['product-public-location', productId],
        queryFn: () => getProductPublicLocation(productId),
        enabled: Boolean(productId),
    })
}