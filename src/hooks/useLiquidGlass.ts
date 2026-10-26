import { LiquidGlass } from '@ybouane/liquidglass';
import { useEffect, type RefObject } from 'react';

// ガラスにする要素に渡すprops。要素はroot（App）の直接の子である必要がある。
// 既定はカード用で、liquid-glass.ybouane.com の「Dark Glass」相当。
// ぼかしなし（Regular Glass）だと背景の模様が文字の裏で透けて読めないため、軽くぼかして暗くする。
// 屈折・縁の厚みなどはライブラリの既定値のままにしてガラスらしさを残す
export const glass = (config: object) => ({
  'data-glass': '',
  'data-config': JSON.stringify({
    blurAmount: 0.4,
    brightness: 0,
    // 縁の光（既定値0.05）を強めて輪郭を際立たせる
    edgeHighlight: 0.1,
    ...config,
  }),
});

// ボタン用（デモ上部の「View on GitHub」ボタンと同じ設定）。角をボタンの高さに合わせたピル型にする
export const clearGlass = (height: number, config: object = {}) =>
  glass({
    button: true,
    blurAmount: 0.3,
    brightness: -0.1,
    cornerRadius: height / 2,
    ...config,
  });

// root直下の [data-glass] 要素に Liquid Glass を適用する
export function useLiquidGlass(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let instance: LiquidGlass | null = null;
    let cancelled = false;

    (async () => {
      // 背景画像の読み込み前に初期化すると真っ白な背景をサンプリングしてしまう
      await Promise.all(
        [...root.querySelectorAll('img')].map((img) =>
          img.decode().catch(() => {}),
        ),
      );
      if (cancelled) return;
      try {
        const created = await LiquidGlass.init({
          root,
          glassElements: root.querySelectorAll<HTMLElement>('[data-glass]'),
        });
        if (cancelled) created.destroy();
        else instance = created;
      } catch (err) {
        // WebGL非対応などはCSSのフォールバック表示のまま
        console.error('LiquidGlass init failed:', err);
      }
    })();

    // ライブラリは変更が記録されたフレームしか描き直さず、CSSトランジションによる移動を検知しない。
    // そのままだと描画済みのcanvasが要素ごと動き、背景がガラスにくっついて見えるので、
    // ガラス要素がトランジション中の間は毎フレーム描き直しを依頼する
    const moving = new Set<HTMLElement>();
    let raf = 0;
    const tick = () => {
      for (const el of moving) instance?.markChanged(el);
      raf = moving.size > 0 ? requestAnimationFrame(tick) : 0;
    };
    const glassTarget = (e: TransitionEvent) =>
      e.target instanceof HTMLElement && e.target.hasAttribute('data-glass')
        ? e.target
        : null;
    const onStart = (e: TransitionEvent) => {
      const el = glassTarget(e);
      if (!el) return;
      moving.add(el);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onEnd = (e: TransitionEvent) => {
      const el = glassTarget(e);
      if (!el) return;
      moving.delete(el);
      instance?.markChanged(el);
    };
    root.addEventListener('transitionrun', onStart);
    root.addEventListener('transitionend', onEnd);
    root.addEventListener('transitioncancel', onEnd);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      root.removeEventListener('transitionrun', onStart);
      root.removeEventListener('transitionend', onEnd);
      root.removeEventListener('transitioncancel', onEnd);
      instance?.destroy();
    };
  }, [rootRef]);
}
