export function makeTemplate() {
  return `
        <!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Confirm your email</title>

  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->

  <style>
    /* Client Resets */
    html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
    * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; }
    img { -ms-interpolation-mode:bicubic; }
    a { text-decoration:none; }
    /* iOS link styling fix */
    a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
    /* Gmail dark mode */
    u + #body a { color: inherit; }
    /* Mobile */
    @media screen and (max-width: 600px) {
      .container { width:100% !important; }
      .px-24 { padding-left:16px !important; padding-right:16px !important; }
      .pt-32 { padding-top:24px !important; }
      .pb-32 { padding-bottom:24px !important; }
      .btn { width:100% !important; }
    }
    /* Optional dark mode (supported in Apple Mail, some clients) */
    @media (prefers-color-scheme: dark) {
      body, table.bg-body { background:#0b0f14 !important; }
      .card { background:#101823 !important; }
      .text { color:#e6edf6 !important; }
      .muted { color:#9fb0c3 !important; }
      .btn a { color:#ffffff !important; }
    }
  </style>
</head>

<body id="body" style="margin:0; padding:0; background:#f6f9fc;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; opacity:0; color:transparent;">
    Confirm your email to activate your account. This link expires in 60 minutes.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="bg-body" style="background:#f6f9fc;">
    <tr>
      <td align="center" style="padding:24px;">
        <!-- Outer container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:100%;">
          <!-- Brand/Header -->
          <tr>
            <td class="px-24" style="padding:8px 24px 16px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font:700 20px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#0f172a;">
                    {{COMPANY_NAME}}
                  </td>
                  <td align="right" style="font:400 12px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#64748b;">
                    <a href="{{VERIFICATION_URL}}" style="color:#64748b;">View in browser</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="px-24" style="padding:0 24px 24px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="card" style="background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(2,8,23,0.08);">
                <tr>
                  <td class="pt-32" style="padding:32px 32px 0 32px;">
                    <h1 class="text" style="margin:0 0 8px 0; font:700 24px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#0f172a;">
                      Confirm your email
                    </h1>
                    <p class="text" style="margin:0; font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#334155;">
                      Hi {{NAME}}, thanks for signing up. Please verify your email address to activate your account. For security, this link expires in <strong>60 minutes</strong>.
                    </p>
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding:24px 32px 8px 32px;">
                    <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                        href="{{VERIFICATION_URL}}" style="height:44px;v-text-anchor:middle;width:260px;" arcsize="12%" stroke="f" fillcolor="#2563eb">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
                          Verify Email
                        </center>
                      </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-- -->
                    <a class="btn" href="{{VERIFICATION_URL}}"
                       style="display:inline-block; padding:12px 24px; font:700 16px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#ffffff; background:#2563eb; border-radius:8px; text-align:center;">
                      Verify Email
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>

                <!-- Secondary text -->
                <tr>
                  <td style="padding:8px 32px 0 32px;">
                    <p class="muted" style="margin:0; font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#64748b;">
                      If the button doesn’t work, copy and paste this URL into your browser:
                    </p>
                    <p style="margin:8px 0 0 0; word-break:break-all; font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif;">
                      <a href="{{VERIFICATION_URL}}" style="color:#2563eb;">{{VERIFICATION_URL}}</a>
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:24px 32px 0 32px;">
                    <hr style="border:none; border-top:1px solid #e2e8f0; margin:0;">
                  </td>
                </tr>

                <!-- Help + Security -->
                <tr>
                  <td class="pb-32" style="padding:16px 32px 32px 32px;">
                    <p class="muted" style="margin:0 0 8px 0; font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#64748b;">
                      Didn’t create an account? You can safely ignore this email. For help, contact
                      <a href="mailto:{{SUPPORT_EMAIL}}" style="color:#2563eb;">{{SUPPORT_EMAIL}}</a>.
                    </p>
                    <p class="muted" style="margin:0; font:400 11px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#94a3b8;">
                      This verification link will expire after 60 minutes for your security.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px-24" style="padding:0 24px 24px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:12px 0; font:400 11px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#94a3b8;">
                    © {{COMPANY_NAME}} • {{COMPANY_ADDRESS}}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 0 8px 0; font:400 11px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#94a3b8;">
                    You’re receiving this because an account was created using this email address.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
