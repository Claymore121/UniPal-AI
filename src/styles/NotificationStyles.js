// Tipos soportados y sus clases Tailwind
export const TYPE_STYLES = {
  alert: {
    bg: "bg-red-50",
    border: "border-red-500",
    title: "text-red-800",
    icon: "text-red-600",
  },
  reminder: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    title: "text-blue-800",
    icon: "text-blue-600",
  },
  achievement: {
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    title: "text-emerald-800",
    icon: "text-emerald-600",
  },
  support: {
    bg: "bg-violet-50",
    border: "border-violet-500",
    title: "text-violet-800",
    icon: "text-violet-600",
  },
  update: {
    bg: "bg-indigo-50",
    border: "border-indigo-500",
    title: "text-indigo-800",
    icon: "text-indigo-600",
  },
  default: {
    bg: "bg-slate-50",
    border: "border-slate-400",
    title: "text-slate-800",
    icon: "text-slate-600",
  },
};

export function getTypeClasses(type) {
  return TYPE_STYLES[type] || TYPE_STYLES.default;
}
