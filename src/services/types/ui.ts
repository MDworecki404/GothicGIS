import z from "zod"
import { ACTION_NAMES } from "../actions"

export const IconButtonSchema = z.object({
    type: z.literal('icon-button'),
    icon: z.string(),
    tooltip: z.object({
        text: z.string(),
        position: z.enum(['top', 'bottom', 'left', 'right'])
    }),
    role: z.array(z.enum(['viewer', 'editor', 'admin'])).optional(),
    action: z.enum(ACTION_NAMES),
})

export const SpeedDialSchema = z.object({
    type: z.literal('speed-dial'),
    icon: z.string(),
    tooltip: z.object({
        text: z.string(),
        position: z.enum(['top', 'bottom', 'left', 'right'])
    }),
    role: z.array(z.enum(['viewer', 'editor', 'admin'])).optional(),
    children: z.array(IconButtonSchema)
})

export type SpeedDial = z.infer<typeof SpeedDialSchema>

export type IconButton = z.infer<typeof IconButtonSchema>

export const UiButtonsSchema = z.discriminatedUnion('type', [
    IconButtonSchema,
    SpeedDialSchema,
])

export type UiButtons = z.infer<typeof UiButtonsSchema>[]