import z from "zod"

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    initView: z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        heading: z.number(),
        pitch: z.number(),
    }).optional()
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
    parentId: z.string().optional(),
})

export const Cesium3DTilesResourceSchema = z.object({
    ionId: z.number()
})

export const Cesium3DTilesLayerCollectionItemSchema = LayerCollectionItemBaseSchema.extend({
    type: z.literal("cesium3DTiles"),
    resource: Cesium3DTilesResourceSchema
})

export const GeoJSONResourceSchema = z.object({
    ionId: z.number()
})

export const GeoJSONLayerCollectionItemSchema = LayerCollectionItemBaseSchema.extend({
    type: z.literal("geoJSON"),
    resource: GeoJSONResourceSchema
})

export const LayerItems = z.discriminatedUnion("type", [
    Cesium3DTilesLayerCollectionItemSchema,
    GeoJSONLayerCollectionItemSchema
])

export type LayerCollectionItem = z.infer<typeof LayerItems>

export const LayerTypes = LayerItems.options.map(option => option.shape.type.value)