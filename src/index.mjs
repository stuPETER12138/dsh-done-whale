import z from '@deepseek-ai/schemastery';
import { SETTINGS_NAMESPACE, DEFAULT_GREEN, DEFAULT_AMBER, HEX } from './shared.mjs';

export { SETTINGS_NAMESPACE, DEFAULT_GREEN, DEFAULT_AMBER } from './shared.mjs';
export const WhaleSettingsSchema = z.object({
  green: z.string().pattern(HEX).default(DEFAULT_GREEN),
  amber: z.string().pattern(HEX).default(DEFAULT_AMBER),
  black: z.string().pattern(HEX),
});

export default {
  name: 'dsh-done-whale',
  inject: ['settings'],
  apply(ctx) {
    ctx.settings.register(SETTINGS_NAMESPACE, WhaleSettingsSchema);
  },
};
