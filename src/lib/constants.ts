export const DEAL_STAGES = [
  { value: "リード", label: "リード", probability: 10, color: "bg-slate-400" },
  { value: "アポイント", label: "アポイント", probability: 20, color: "bg-blue-400" },
  { value: "ヒアリング", label: "ヒアリング", probability: 40, color: "bg-cyan-400" },
  { value: "提案", label: "提案", probability: 60, color: "bg-yellow-400" },
  { value: "見積", label: "見積", probability: 75, color: "bg-orange-400" },
  { value: "交渉", label: "交渉", probability: 90, color: "bg-purple-400" },
  { value: "受注", label: "受注", probability: 100, color: "bg-green-500" },
  { value: "失注", label: "失注", probability: 0, color: "bg-red-500" },
] as const;

export const ACTIVE_DEAL_STAGES = DEAL_STAGES.filter(
  (s) => s.value !== "受注" && s.value !== "失注"
);

export const ACTIVITY_TYPES = [
  { value: "電話", label: "電話", icon: "Phone" },
  { value: "メール", label: "メール", icon: "Mail" },
  { value: "訪問", label: "訪問", icon: "MapPin" },
  { value: "会議", label: "会議", icon: "Users" },
  { value: "タスク", label: "タスク", icon: "CheckSquare" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "高", label: "高", color: "text-red-600" },
  { value: "中", label: "中", color: "text-yellow-600" },
  { value: "低", label: "低", color: "text-green-600" },
] as const;

export const INDUSTRY_OPTIONS = [
  "IT・通信",
  "製造業",
  "金融・保険",
  "小売・卸売",
  "不動産",
  "医療・福祉",
  "教育",
  "サービス業",
  "建設",
  "運輸・物流",
  "その他",
] as const;
