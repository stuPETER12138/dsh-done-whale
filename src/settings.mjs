import { createElement as h, useState, useSyncExternalStore } from 'react';
import { colorsOf, HEX, SETTINGS_NAMESPACE } from './shared.mjs';

export const messages = {
  zh: { nav: '鲸鱼状态灯', green: '完成色', amber: '待处理色', black: '默认色',
    hint: '不设置时使用官方图标', reset: '恢复默认', invalid: '颜色格式应为 #RRGGBB', failed: '保存失败，请重试' },
  en: { nav: 'Whale status', green: 'Done color', amber: 'Pending color', black: 'Default color',
    hint: 'Uses the official icon when unset', reset: 'Reset', invalid: 'Color must be #RRGGBB', failed: 'Could not save; please retry' },
};
const fieldStyle = {
  font: 'inherit', padding: '6px 10px', borderRadius: 6,
  border: '1px solid var(--dsw-alias-border-l2)',
  background: 'transparent', color: 'var(--dsw-alias-label-primary)',
};

function ColorRow({ scope, t, name, value, writable, saving, setSaving }) {
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);
  const effective = colorsOf(value)[name] ?? '#000000';
  const text = draft ?? effective;
  const invalid = !HEX.test(text);
  const id = `${SETTINGS_NAMESPACE}-${name}`;
  async function save(reset = false, next = text) {
    if (!reset && !HEX.test(next)) return;
    setSaving(true);
    setError(null);
    try {
      if (reset) await scope.unset(name);
      else await scope.set(name, next);
      // The official scope recovers rejected writes without necessarily throwing.
      const accepted = scope.getSnapshot();
      if (reset ? Object.hasOwn(accepted.user ?? {}, name) : accepted.value?.[name] !== next) {
        throw new Error('Setting was not accepted');
      }
      setDraft(null);
    } catch {
      setError(t('failed'));
    } finally {
      setSaving(false);
    }
  }
  return h('div', { style: { display: 'grid', gap: 6 } },
    h('label', { htmlFor: id }, t(name)),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
      h('input', { type: 'color', 'aria-label': t(name), value: invalid ? effective : text,
        disabled: saving || !writable, onChange: e => { setDraft(e.target.value); void save(false, e.target.value); },
        style: { ...fieldStyle, width: 40, height: 32, padding: 0 } }),
      h('input', { id, type: 'text', value: text, spellCheck: false, disabled: saving || !writable,
        'aria-invalid': invalid || !!error, 'aria-describedby': `${id}-hint`,
        onChange: e => { setDraft(e.target.value); setError(null); },
        onBlur: () => { if (draft !== null) void save(); },
        onKeyDown: e => { if (e.key === 'Enter') e.currentTarget.blur(); },
        style: { ...fieldStyle, width: '8em' } }),
      h('button', { type: 'button', disabled: saving || !writable, onClick: () => void save(true), style: fieldStyle }, t('reset'))),
    h('small', { id: `${id}-hint`, role: invalid || error ? 'alert' : undefined },
      invalid ? t('invalid') : error ?? (name === 'black' && !value.black ? t('hint') : '')));
}

export function WhaleSettingsSection({ scope, t }) {
  const [saving, setSaving] = useState(false);
  const { value = {}, writable = false } = useSyncExternalStore(
    listener => scope.subscribe(listener), () => scope.getSnapshot());
  return h('div', { style: { display: 'grid', gap: 16, padding: '16px 0' } },
    ...['green', 'amber', 'black'].map(name => h(ColorRow, { key: name, name, scope, t, value, writable, saving, setSaving })));
}
