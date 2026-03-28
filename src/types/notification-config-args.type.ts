import { type TbxMatNotificationConfig } from '../models/notification-config.model';

/**
 * Optional configuration for the convenience notification methods
 * (success, error, warn, info, help). Omits `type` and `message`
 * since those are set by the convenience method and call arguments.
 */
export type TbxMatNotificationConfigArgsType = Omit<TbxMatNotificationConfig, 'type' | 'message'>;
