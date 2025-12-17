import z from "zod"

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})
export type Project = z.infer<typeof ProjectSchema>

export const UserCollectionSchema = z.object({
    email: z.string(),
    role: z.enum(["admin", "editor", "viewer"]),
})
export type UserCollection = z.infer<typeof UserCollectionSchema>

export const LayerCollectionItemBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    show: z.boolean(),
})

export const Cesium3DTilesResourceSchema = z.object({
    ionId: z.number()
})

export const Cesium3DTilesLayerCollectionItemSchema = LayerCollectionItemBaseSchema.extend({
    type: z.literal("cesium3DTiles"),
    resource: Cesium3DTilesResourceSchema
})

export const LayerItems = z.discriminatedUnion("type", [
    Cesium3DTilesLayerCollectionItemSchema,
    // Add other layer types here
])

export type LayerCollectionItem = z.infer<typeof LayerItems>