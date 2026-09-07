// app/billing/BillingShell.jsx
//
// Shared full-viewport shell + brand styling for /paused and /billing/pay.
// Both routes render inside the app's dashboard root layout (app/layout.js),
// so this uses fixed positioning to escape that sidebar-oriented wrapper and
// behave as a true full-screen takeover regardless of what it's nested in
// (an iframe on a POS device, a bare browser tab, or nested inside /paused).

import mosyThemeConfigs from '../appConfigs/mosyTheme';

export const SUPPORT_WHATSAPP = '254700000000'; // TODO: replace with the real Asanetic support line
export const SUPPORT_WHATSAPP_DISPLAY = '+254 700 000 000';

export function BillingStyles() {
  return (
    <style>{`
      .billing_shell {
        position: fixed;
        inset: 0;
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        overflow-y: auto;
        background: ${mosyThemeConfigs.bodyColor};
      }

      .billing_card {
        width: 100%;
        max-width: 460px;
        background: ${mosyThemeConfigs.ctnBg};
        color: ${mosyThemeConfigs.ctnTxt};
        border-radius: ${mosyThemeConfigs.systemBorderRadius};
        box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        padding: 36px 30px;
        text-align: center;
        margin: auto;
      }

      .billing_logo {
        max-height: 42px;
        width: auto;
        margin-bottom: 18px;
      }

      .billing_headline {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: -0.3px;
      }

      .billing_subtext {
        font-size: 14px;
        opacity: 0.75;
        margin-bottom: 22px;
        line-height: 1.5;
      }

      .billing_summary {
        text-align: left;
        border: 1px solid ${mosyThemeConfigs.genBorderColor}33;
        border-radius: calc(${mosyThemeConfigs.systemBorderRadius} / 1.5);
        padding: 16px 18px;
        margin-bottom: 22px;
      }

      .billing_summary_row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 6px 0;
        font-size: 14px;
      }

      .billing_summary_row + .billing_summary_row {
        border-top: 1px dashed ${mosyThemeConfigs.genBorderColor}33;
      }

      .billing_summary_label {
        opacity: 0.65;
      }

      .billing_summary_value {
        font-weight: 600;
        text-align: right;
      }

      .billing_amount {
        font-size: 26px;
        font-weight: 700;
        margin: 4px 0 20px;
        color: ${mosyThemeConfigs.btnSecondColor};
      }

      .billing_btn_primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        border: 0;
        cursor: pointer;
        height: 50px;
        border-radius: ${mosyThemeConfigs.systemBorderRadius};
        font-size: 15px;
        font-weight: 600;
        color: ${mosyThemeConfigs.btnTxt};
        background: linear-gradient(225deg, ${mosyThemeConfigs.btnFirstColor}, ${mosyThemeConfigs.btnSecondColor});
        transition: transform 0.15s ease, opacity 0.15s ease;
      }

      .billing_btn_primary:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .billing_btn_primary:not(:disabled):hover {
        transform: translateY(-1px);
      }

      .billing_input {
        width: 100%;
        height: 48px;
        border-radius: ${mosyThemeConfigs.systemBorderRadius};
        border: 1px solid ${mosyThemeConfigs.genBorderColor}66;
        padding: 0 16px;
        font-size: 15px;
        margin-bottom: 14px;
        box-sizing: border-box;
      }

      .billing_input:focus {
        outline: none;
        border-color: ${mosyThemeConfigs.btnBg};
      }

      .billing_label {
        display: block;
        text-align: left;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 6px;
        opacity: 0.8;
      }

      .billing_support {
        margin-top: 22px;
        font-size: 12.5px;
        opacity: 0.6;
      }

      .billing_support a {
        color: ${mosyThemeConfigs.btnBg};
        text-decoration: none;
        font-weight: 600;
      }

      .billing_iframe_wrap {
        margin: 22px -30px -36px;
        padding-top: 18px;
        border-top: 1px solid ${mosyThemeConfigs.genBorderColor}26;
        animation: billing_slide_down 0.25s ease;
      }

      @keyframes billing_slide_down {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .billing_iframe {
        width: 100%;
        height: 360px;
        border: 0;
        display: block;
        transition: height 0.2s ease;
      }

      @media (max-width: 400px) {
        .billing_iframe_wrap {
          margin: 18px -18px -26px;
        }
      }

      .billing_shell_embedded {
        position: static;
        inset: auto;
        z-index: auto;
        min-height: 0;
        padding: 4px 30px 28px;
        background: transparent;
      }

      .billing_card_embedded {
        width: 100%;
        max-width: none;
        background: transparent;
        color: ${mosyThemeConfigs.ctnTxt};
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        margin: 0;
        text-align: center;
      }

      @media (max-width: 400px) {
        .billing_shell_embedded {
          padding: 4px 18px 20px;
        }
      }

      .billing_spinner {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid ${mosyThemeConfigs.btnBg}33;
        border-top-color: ${mosyThemeConfigs.btnBg};
        margin: 0 auto 16px;
        animation: billing_spin 0.8s linear infinite;
      }

      @keyframes billing_spin {
        to { transform: rotate(360deg); }
      }

      .billing_progress_track {
        width: 100%;
        height: 6px;
        border-radius: 999px;
        background: ${mosyThemeConfigs.genBorderColor}22;
        overflow: hidden;
        margin: 6px 0 18px;
      }

      .billing_progress_fill {
        height: 100%;
        background: ${mosyThemeConfigs.btnBg};
        transition: width 0.4s ease;
      }

      .billing_paybill_box {
        text-align: left;
        font-size: 13px;
        line-height: 1.7;
        background: ${mosyThemeConfigs.btnBg}0d;
        border-radius: calc(${mosyThemeConfigs.systemBorderRadius} / 1.5);
        padding: 14px 16px;
        margin-top: 18px;
      }

      .billing_badge_soft {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 999px;
        margin-bottom: 14px;
        background: ${mosyThemeConfigs.btnBg}1a;
        color: ${mosyThemeConfigs.btnBg};
      }

      .billing_badge_firm {
        background: #e0245022;
        color: #c81e3f;
      }

      .billing_error_text {
        font-size: 13px;
        color: #c81e3f;
        margin-bottom: 14px;
      }

      .billing_link_btn {
        background: none;
        border: 0;
        color: ${mosyThemeConfigs.btnBg};
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        padding: 10px;
      }

      @media (max-width: 400px) {
        .billing_card {
          padding: 26px 18px;
          border-radius: 18px;
        }
      }
    `}</style>
  );
}

export function BillingCard({ children, embedded = false }) {
  if (embedded) {
    // Rendered inside the /paused iframe: the parent page already supplies
    // the card chrome (logo, shadow, rounded corners), so this just lays
    // out the same content flat instead of stacking a second card on top.
    return (
      <div className="billing_shell_embedded">
        <div className="billing_card_embedded">{children}</div>
      </div>
    );
  }

  return (
    <div className="billing_shell">
      <div className="billing_card">
        {mosyThemeConfigs.mosyAppLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mosyThemeConfigs.mosyAppLogo} alt={mosyThemeConfigs.mosyAppName} className="billing_logo" />
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function SupportLine({ text = 'Think this is a mistake?' }) {
  return (
    <div className="billing_support">
      {text}{' '}
      <a href={`https://wa.me/${SUPPORT_WHATSAPP}`} target="_blank" rel="noreferrer">
        Chat with support on WhatsApp
      </a>
    </div>
  );
}
