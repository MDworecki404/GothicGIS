import z from "zod"
import { ACTION_NAMES } from "../actions"

export const IconButtonSchema = z.object({
    type: z.literal('icon-button'),
    icon: z.string(),
    tooltip: z.object({
        text: z.string(),
        position: z.enum(['top', 'bottom', 'left', 'right'])
    }),
})

export type IconButton = z.infer<typeof IconButtonSchema>

const ActionSchema = z.object({
    action: z.enum(ACTION_NAMES),
})

export const UiButtonsSchema = z.discriminatedUnion('type', [
    IconButtonSchema,
]).and(ActionSchema)

export type UiButtons = z.infer<typeof UiButtonsSchema>[]