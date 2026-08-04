import { makeStyles, shorthands } from "@griffel/react";
import { colors, gradients } from "../../common/theme/colors";
import { layout, typography } from "../../common/theme/typography";

export const useHomeStyles = makeStyles({
  page: { fontFamily: typography.sans, backgroundColor: colors.cream, minHeight: "100vh" },
  hero: {
    display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
    gap: "48px", padding: `${layout.navHeight + 60}px 56px 100px`, maxWidth: "1280px", margin: "0 auto",
  },
  intro: { flexGrow: 1, flexShrink: 1, flexBasis: "420px", display: "flex", flexDirection: "column", gap: "26px", maxWidth: "520px", marginTop: "-80px" },
  title: { fontFamily: typography.serif, fontSize: "clamp(38px, 4.6vw, 58px)", fontWeight: 400, color: colors.charcoal, lineHeight: 1.15, letterSpacing: "-0.5px", margin: 0 },
  gradientText: { fontStyle: "italic", display: "inline-block", backgroundImage: gradients.primary, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: colors.transparent, color: colors.transparent },
  description: { fontSize: "17px", color: colors.warmGray, lineHeight: 1.75, margin: 0, maxWidth: "420px" },
  primaryButton: {
    display: "inline-flex", alignItems: "center", columnGap: "8px", fontSize: "15px", fontWeight: 600,
    color: colors.white, backgroundImage: gradients.primary, ...shorthands.border("none"), borderRadius: "100px",
    padding: "15px 30px", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 10px 26px ${colors.roseGlow}`,
    transitionProperty: "transform, box-shadow", transitionDuration: "0.15s", transitionTimingFunction: "ease",
    ":hover": { transform: "translateY(-2px)", boxShadow: `0 14px 30px ${colors.roseHoverGlow}` },
  },
  visual: { flexGrow: 1, flexShrink: 1, flexBasis: "380px", maxWidth: "480px", position: "relative", display: "flex", justifyContent: "center", padding: "20px 0" },
  peachBlob: { position: "absolute", top: "-6%", right: "6%", width: "78%", height: "78%", borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%", backgroundColor: colors.peach, opacity: 0.6, filter: "blur(2px)", zIndex: 0 },
  roseBlob: { position: "absolute", bottom: "-4%", left: "2%", width: "36%", height: "36%", borderRadius: "50%", backgroundColor: colors.rose, opacity: 0.25, zIndex: 0 },
  photoCard: { position: "relative", zIndex: 1, width: "100%", aspectRatio: "4 / 5", borderRadius: "28px", overflow: "hidden", transform: "rotate(-2.5deg)", boxShadow: `0 30px 60px -20px ${colors.charcoalPhotoShadow}`, ...shorthands.border("8px", "solid", colors.white) },
  photo: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
});
