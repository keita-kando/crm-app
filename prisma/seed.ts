import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.account.deleteMany();

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: "株式会社テクノソリューション",
        industry: "IT・通信",
        phone: "03-1234-5678",
        website: "https://techno-sol.example.com",
        address: "東京都千代田区丸の内1-1-1",
        annualRevenue: 5000000000,
        employees: 500,
        description: "クラウドソリューションを提供するIT企業",
      },
    }),
    prisma.account.create({
      data: {
        name: "合同会社グリーンエナジー",
        industry: "製造業",
        phone: "06-2345-6789",
        address: "大阪府大阪市北区梅田2-2-2",
        annualRevenue: 3000000000,
        employees: 300,
      },
    }),
    prisma.account.create({
      data: {
        name: "東京フィナンシャルグループ株式会社",
        industry: "金融・保険",
        phone: "03-3456-7890",
        address: "東京都中央区日本橋3-3-3",
        annualRevenue: 10000000000,
        employees: 2000,
      },
    }),
    prisma.account.create({
      data: {
        name: "株式会社メディカルプラス",
        industry: "医療・福祉",
        phone: "045-4567-8901",
        address: "神奈川県横浜市西区みなとみらい4-4-4",
        annualRevenue: 1500000000,
        employees: 150,
      },
    }),
    prisma.account.create({
      data: {
        name: "株式会社リテールワン",
        industry: "小売・卸売",
        phone: "052-5678-9012",
        address: "愛知県名古屋市中区栄5-5-5",
        annualRevenue: 8000000000,
        employees: 1200,
      },
    }),
    prisma.account.create({
      data: {
        name: "株式会社ビルドマスター",
        industry: "建設",
        phone: "092-6789-0123",
        address: "福岡県福岡市博多区博多駅前6-6-6",
        annualRevenue: 2000000000,
        employees: 400,
      },
    }),
    prisma.account.create({
      data: {
        name: "株式会社エデュケーションラボ",
        industry: "教育",
        phone: "011-7890-1234",
        address: "北海道札幌市中央区大通西7-7-7",
        annualRevenue: 500000000,
        employees: 80,
      },
    }),
    prisma.account.create({
      data: {
        name: "合同会社ロジスティクスプロ",
        industry: "運輸・物流",
        phone: "078-8901-2345",
        address: "兵庫県神戸市中央区三宮町8-8-8",
        annualRevenue: 4000000000,
        employees: 600,
      },
    }),
    prisma.account.create({
      data: {
        name: "株式会社不動産サポート",
        industry: "不動産",
        phone: "048-9012-3456",
        address: "埼玉県さいたま市大宮区桜木町9-9-9",
        annualRevenue: 1200000000,
        employees: 100,
      },
    }),
    prisma.account.create({
      data: {
        name: "株式会社サービスイノベーション",
        industry: "サービス業",
        phone: "075-0123-4567",
        address: "京都府京都市下京区四条烏丸10-10-10",
        annualRevenue: 700000000,
        employees: 120,
      },
    }),
  ]);

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({ data: { lastName: "田中", firstName: "太郎", email: "tanaka@techno-sol.example.com", phone: "090-1111-1111", title: "代表取締役", department: "経営企画部", accountId: accounts[0].id } }),
    prisma.contact.create({ data: { lastName: "佐藤", firstName: "花子", email: "sato@techno-sol.example.com", phone: "090-2222-2222", title: "営業部長", department: "営業部", accountId: accounts[0].id } }),
    prisma.contact.create({ data: { lastName: "鈴木", firstName: "一郎", email: "suzuki@green-energy.example.com", phone: "090-3333-3333", title: "CTO", department: "技術部", accountId: accounts[1].id } }),
    prisma.contact.create({ data: { lastName: "高橋", firstName: "美咲", email: "takahashi@green-energy.example.com", phone: "090-4444-4444", title: "課長", department: "情報システム部", accountId: accounts[1].id } }),
    prisma.contact.create({ data: { lastName: "伊藤", firstName: "健太", email: "ito@tokyo-fin.example.com", phone: "090-5555-5555", title: "常務取締役", department: "経営企画室", accountId: accounts[2].id } }),
    prisma.contact.create({ data: { lastName: "渡辺", firstName: "さくら", email: "watanabe@tokyo-fin.example.com", phone: "090-6666-6666", title: "部長", department: "DX推進部", accountId: accounts[2].id } }),
    prisma.contact.create({ data: { lastName: "山本", firstName: "大輔", email: "yamamoto@medical-plus.example.com", phone: "090-7777-7777", title: "院長", department: "管理部", accountId: accounts[3].id } }),
    prisma.contact.create({ data: { lastName: "中村", firstName: "真理", email: "nakamura@medical-plus.example.com", phone: "090-8888-8888", title: "主任", department: "購買部", accountId: accounts[3].id } }),
    prisma.contact.create({ data: { lastName: "小林", firstName: "翔太", email: "kobayashi@retail-one.example.com", phone: "090-9999-9999", title: "取締役", department: "事業開発部", accountId: accounts[4].id } }),
    prisma.contact.create({ data: { lastName: "加藤", firstName: "裕子", email: "kato@retail-one.example.com", phone: "080-1111-2222", title: "マネージャー", department: "マーケティング部", accountId: accounts[4].id } }),
    prisma.contact.create({ data: { lastName: "吉田", firstName: "拓也", email: "yoshida@build-master.example.com", phone: "080-3333-4444", title: "専務", department: "営業本部", accountId: accounts[5].id } }),
    prisma.contact.create({ data: { lastName: "山田", firstName: "愛", email: "yamada@build-master.example.com", phone: "080-5555-6666", title: "係長", department: "総務部", accountId: accounts[5].id } }),
    prisma.contact.create({ data: { lastName: "佐々木", firstName: "健", email: "sasaki@edu-lab.example.com", phone: "080-7777-8888", title: "理事長", department: "運営部", accountId: accounts[6].id } }),
    prisma.contact.create({ data: { lastName: "松本", firstName: "由美", email: "matsumoto@edu-lab.example.com", phone: "080-9999-0000", title: "教務主任", department: "教務部", accountId: accounts[6].id } }),
    prisma.contact.create({ data: { lastName: "井上", firstName: "亮", email: "inoue@logistics-pro.example.com", phone: "070-1111-3333", title: "執行役員", department: "物流企画部", accountId: accounts[7].id } }),
    prisma.contact.create({ data: { lastName: "木村", firstName: "千恵", email: "kimura@logistics-pro.example.com", phone: "070-4444-5555", title: "リーダー", department: "システム部", accountId: accounts[7].id } }),
    prisma.contact.create({ data: { lastName: "林", firstName: "大地", email: "hayashi@fudosan-support.example.com", phone: "070-6666-7777", title: "支店長", department: "営業部", accountId: accounts[8].id } }),
    prisma.contact.create({ data: { lastName: "清水", firstName: "美月", email: "shimizu@fudosan-support.example.com", phone: "070-8888-9999", title: "主任", department: "管理部", accountId: accounts[8].id } }),
    prisma.contact.create({ data: { lastName: "藤田", firstName: "翼", email: "fujita@service-inno.example.com", phone: "050-1111-4444", title: "CEO", department: "経営企画部", accountId: accounts[9].id } }),
    prisma.contact.create({ data: { lastName: "岡田", firstName: "恵", email: "okada@service-inno.example.com", phone: "050-5555-8888", title: "ディレクター", department: "事業部", accountId: accounts[9].id } }),
  ]);

  // Create deals
  const now = new Date();
  const deals = await Promise.all([
    prisma.deal.create({ data: { name: "クラウドシステム導入案件", amount: 50000000, stage: "提案", probability: 60, closeDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), accountId: accounts[0].id, contactId: contacts[1].id } }),
    prisma.deal.create({ data: { name: "基幹システム刷新プロジェクト", amount: 300000000, stage: "ヒアリング", probability: 40, closeDate: new Date(now.getFullYear(), now.getMonth() + 3, 30), accountId: accounts[0].id, contactId: contacts[0].id } }),
    prisma.deal.create({ data: { name: "IoTセンサー導入", amount: 15000000, stage: "リード", probability: 10, closeDate: new Date(now.getFullYear(), now.getMonth() + 2, 20), accountId: accounts[1].id, contactId: contacts[2].id } }),
    prisma.deal.create({ data: { name: "生産管理システム更新", amount: 80000000, stage: "見積", probability: 75, closeDate: new Date(now.getFullYear(), now.getMonth() + 1, 28), accountId: accounts[1].id, contactId: contacts[3].id } }),
    prisma.deal.create({ data: { name: "オンラインバンキング刷新", amount: 500000000, stage: "交渉", probability: 90, closeDate: new Date(now.getFullYear(), now.getMonth(), 25), accountId: accounts[2].id, contactId: contacts[5].id } }),
    prisma.deal.create({ data: { name: "セキュリティ監査ツール導入", amount: 20000000, stage: "アポイント", probability: 20, closeDate: new Date(now.getFullYear(), now.getMonth() + 4, 10), accountId: accounts[2].id, contactId: contacts[4].id } }),
    prisma.deal.create({ data: { name: "電子カルテシステム", amount: 45000000, stage: "提案", probability: 60, closeDate: new Date(now.getFullYear(), now.getMonth() + 2, 5), accountId: accounts[3].id, contactId: contacts[6].id } }),
    prisma.deal.create({ data: { name: "ECサイトリニューアル", amount: 35000000, stage: "受注", probability: 100, closeDate: new Date(now.getFullYear(), now.getMonth() - 1, 15), accountId: accounts[4].id, contactId: contacts[8].id } }),
    prisma.deal.create({ data: { name: "POSシステム更新", amount: 25000000, stage: "受注", probability: 100, closeDate: new Date(now.getFullYear(), now.getMonth() - 2, 20), accountId: accounts[4].id, contactId: contacts[9].id } }),
    prisma.deal.create({ data: { name: "BIMシステム導入", amount: 40000000, stage: "ヒアリング", probability: 40, closeDate: new Date(now.getFullYear(), now.getMonth() + 3, 15), accountId: accounts[5].id, contactId: contacts[10].id } }),
    prisma.deal.create({ data: { name: "eラーニングプラットフォーム", amount: 12000000, stage: "リード", probability: 10, closeDate: new Date(now.getFullYear(), now.getMonth() + 5, 1), accountId: accounts[6].id, contactId: contacts[12].id } }),
    prisma.deal.create({ data: { name: "倉庫管理システム", amount: 60000000, stage: "見積", probability: 75, closeDate: new Date(now.getFullYear(), now.getMonth() + 1, 10), accountId: accounts[7].id, contactId: contacts[14].id } }),
    prisma.deal.create({ data: { name: "不動産管理クラウド", amount: 18000000, stage: "失注", probability: 0, closeDate: new Date(now.getFullYear(), now.getMonth() - 1, 5), accountId: accounts[8].id, contactId: contacts[16].id } }),
    prisma.deal.create({ data: { name: "CRMカスタマイズ", amount: 8000000, stage: "アポイント", probability: 20, closeDate: new Date(now.getFullYear(), now.getMonth() + 2, 28), accountId: accounts[9].id, contactId: contacts[18].id } }),
    prisma.deal.create({ data: { name: "データ分析基盤構築", amount: 100000000, stage: "受注", probability: 100, closeDate: new Date(now.getFullYear(), now.getMonth(), 1), accountId: accounts[2].id, contactId: contacts[5].id } }),
  ]);

  // Create activities
  const activityData = [
    { type: "電話", subject: "初回ヒアリング電話", description: "クラウド移行の要件をヒアリング", accountId: accounts[0].id, contactId: contacts[0].id, dealId: deals[1].id, priority: "高", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5) },
    { type: "メール", subject: "提案資料送付", description: "クラウドシステムの提案資料をメールで送付", accountId: accounts[0].id, contactId: contacts[1].id, dealId: deals[0].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3) },
    { type: "訪問", subject: "現地調査", description: "現行システムの調査のため訪問", accountId: accounts[1].id, contactId: contacts[2].id, dealId: deals[2].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2) },
    { type: "会議", subject: "要件定義ミーティング", description: "生産管理システムの要件定義", accountId: accounts[1].id, contactId: contacts[3].id, dealId: deals[3].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) },
    { type: "タスク", subject: "見積書作成", description: "オンラインバンキング刷新の見積書を作成", accountId: accounts[2].id, dealId: deals[4].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3) },
    { type: "電話", subject: "フォローアップ電話", description: "セキュリティ監査ツールについての確認電話", accountId: accounts[2].id, contactId: contacts[4].id, dealId: deals[5].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7) },
    { type: "メール", subject: "契約書確認依頼", description: "契約書のドラフトを確認依頼", accountId: accounts[2].id, contactId: contacts[5].id, dealId: deals[4].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) },
    { type: "訪問", subject: "デモンストレーション", description: "電子カルテシステムのデモ実施", accountId: accounts[3].id, contactId: contacts[6].id, dealId: deals[6].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5) },
    { type: "タスク", subject: "納品物チェック", description: "ECサイトの最終納品チェック", accountId: accounts[4].id, contactId: contacts[8].id, dealId: deals[7].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10) },
    { type: "会議", subject: "キックオフミーティング", description: "POSシステム更新のキックオフ", accountId: accounts[4].id, contactId: contacts[9].id, dealId: deals[8].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15) },
    { type: "電話", subject: "進捗確認", description: "BIMシステム導入の進捗確認", accountId: accounts[5].id, contactId: contacts[10].id, dealId: deals[9].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4) },
    { type: "メール", subject: "資料送付", description: "eラーニングプラットフォームの概要資料を送付", accountId: accounts[6].id, contactId: contacts[12].id, dealId: deals[10].id, priority: "低", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2) },
    { type: "タスク", subject: "RFP回答作成", description: "倉庫管理システムのRFP回答を作成", accountId: accounts[7].id, contactId: contacts[14].id, dealId: deals[11].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2) },
    { type: "訪問", subject: "現地ヒアリング", description: "物流センターの現場調査", accountId: accounts[7].id, contactId: contacts[15].id, dealId: deals[11].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4) },
    { type: "タスク", subject: "失注分析レポート作成", description: "不動産管理クラウド案件の失注要因を分析", accountId: accounts[8].id, dealId: deals[12].id, priority: "低", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7) },
    { type: "電話", subject: "アポイント設定", description: "CRMカスタマイズの打ち合わせ日程調整", accountId: accounts[9].id, contactId: contacts[18].id, dealId: deals[13].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) },
    { type: "メール", subject: "月次レポート送付", description: "データ分析基盤の月次レポートを送付", accountId: accounts[2].id, contactId: contacts[5].id, dealId: deals[14].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1) },
    { type: "タスク", subject: "提案書レビュー", description: "クラウドシステムの提案書を社内レビュー", accountId: accounts[0].id, dealId: deals[0].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2) },
    { type: "会議", subject: "週次定例会議", description: "基幹システム刷新の週次進捗会議", accountId: accounts[0].id, contactId: contacts[0].id, dealId: deals[1].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3) },
    { type: "電話", subject: "予算確認", description: "IoTセンサー導入の予算感を確認", accountId: accounts[1].id, contactId: contacts[2].id, dealId: deals[2].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6) },
    { type: "タスク", subject: "競合調査", description: "電子カルテシステムの競合製品調査", accountId: accounts[3].id, dealId: deals[6].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4) },
    { type: "メール", subject: "お礼メール", description: "訪問のお礼と議事録を送付", accountId: accounts[5].id, contactId: contacts[10].id, dealId: deals[9].id, priority: "低", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6) },
    { type: "タスク", subject: "契約書準備", description: "オンラインバンキング刷新の契約書を準備", accountId: accounts[2].id, dealId: deals[4].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2) },
    { type: "訪問", subject: "最終プレゼン", description: "生産管理システムの最終プレゼンテーション", accountId: accounts[1].id, contactId: contacts[3].id, dealId: deals[3].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5) },
    { type: "電話", subject: "サポート対応", description: "ECサイトのリリース後サポート対応", accountId: accounts[4].id, contactId: contacts[8].id, dealId: deals[7].id, priority: "中", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8) },
    { type: "タスク", subject: "技術検証", description: "倉庫管理システムのPoC実施準備", accountId: accounts[7].id, dealId: deals[11].id, priority: "高", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3) },
    { type: "会議", subject: "経営層プレゼン", description: "データ分析基盤の成果報告", accountId: accounts[2].id, contactId: contacts[4].id, dealId: deals[14].id, priority: "高", completed: true, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3) },
    { type: "メール", subject: "見積書送付", description: "eラーニングプラットフォームの概算見積を送付", accountId: accounts[6].id, contactId: contacts[12].id, dealId: deals[10].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8) },
    { type: "タスク", subject: "社内承認申請", description: "BIMシステム導入の社内稟議書を作成", accountId: accounts[5].id, dealId: deals[9].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5) },
    { type: "電話", subject: "フィードバック収集", description: "CRMカスタマイズの要望をヒアリング", accountId: accounts[9].id, contactId: contacts[19].id, dealId: deals[13].id, priority: "中", completed: false, dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4) },
  ];

  for (const data of activityData) {
    await prisma.activity.create({ data });
  }

  console.log("Seed data created successfully!");
  console.log(`  Accounts: ${accounts.length}`);
  console.log(`  Contacts: ${contacts.length}`);
  console.log(`  Deals: ${deals.length}`);
  console.log(`  Activities: ${activityData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
