import z from 'zod';
import { ACTION_NAMES } from '../actions';

export const IconButtonSchema = z.object({
    type: z.literal('icon-button'),
    icon: z.string(),
    tooltip: z.object({
        text: z.string(),
        position: z.enum(['top', 'bottom', 'left', 'right']),
    }),
    role: z.array(z.enum(['viewer', 'editor', 'admin'])).optional(),
    action: z.enum(ACTION_NAMES),
});

export const SpeedDialSchema = z.object({
    type: z.literal('speed-dial'),
    icon: z.string(),
    tooltip: z.object({
        text: z.string(),
        position: z.enum(['top', 'bottom', 'left', 'right']),
    }),
    speedDialLocation: z.enum([
        'top',
        'bottom',
        'left',
        'right',
        'start',
        'end',
        'center',
        'center center',
        'top left',
        'top right',
        'top start',
        'top end',
        'top center',
        'bottom left',
        'bottom right',
        'bottom start',
        'bottom end',
        'bottom center',
        'left top',
        'left bottom',
        'left center',
        'right top',
        'right bottom',
        'right center',
        'start top',
        'start bottom',
        'start center',
        'end top',
        'end bottom',
        'end center',
    ]),
    role: z.array(z.enum(['viewer', 'editor', 'admin'])).optional(),
    children: z.array(IconButtonSchema),
});

export type SpeedDial = z.infer<typeof SpeedDialSchema>;

export type IconButton = z.infer<typeof IconButtonSchema>;

export const UiButtonsSchema = z.discriminatedUnion('type', [IconButtonSchema, SpeedDialSchema]);

export type UiButtons = z.infer<typeof UiButtonsSchema>[];

export const ContextMenuItemsSchema = z.object({
    title: z.string(),
    icon: z.string().optional(),
    iconColor: z.string().optional(),
    disabled: z.boolean().optional(),
});

export type ContextMenuItems = (z.infer<typeof ContextMenuItemsSchema> & { action: (...args: any[]) => void })[];
