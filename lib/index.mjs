// src/index.mjs
import z from "@deepseek-ai/schemastery";

// src/shared.mjs
var SETTINGS_NAMESPACE = "done-whale";
var DEFAULT_GREEN = "#22C55E";
var DEFAULT_AMBER = "#F59E0B";
var HEX = /^#[0-9a-fA-F]{6}$/;

// src/index.mjs
var WhaleSettingsSchema = z.object({
  green: z.string().pattern(HEX).default(DEFAULT_GREEN),
  amber: z.string().pattern(HEX).default(DEFAULT_AMBER),
  black: z.string().pattern(HEX)
});
var index_default = {
  name: "dsh-done-whale",
  inject: ["settings"],
  apply(ctx) {
    ctx.settings.register(SETTINGS_NAMESPACE, WhaleSettingsSchema);
  }
};
export {
  DEFAULT_AMBER,
  DEFAULT_GREEN,
  SETTINGS_NAMESPACE,
  WhaleSettingsSchema,
  index_default as default
};
