'use client';

import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpenCheck,
  CalendarCheck2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  House,
  PackageOpen,
  Plus,
  ReceiptText,
  RotateCcw,
  Settings,
  ShoppingBasket,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Expense = {
  id: number;
  title: string;
  category: string;
  amount: number;
  payer: string;
  date: string;
  color: string;
};

type RoomieState = {
  expenses: Expense[];
  choreDone: boolean;
  paperRestocked: boolean;
  agreementConfirmed: boolean;
};

const initialState: RoomieState = {
  expenses: [
    { id: 1, title: '八月电费', category: '水电燃气', amount: 236, payer: 'Mia', date: '9月10日', color: '#E9F5E6' },
    { id: 2, title: '宽带续费', category: '固定支出', amount: 120, payer: '小林', date: '9月8日', color: '#FFF0DE' },
    { id: 3, title: '厨房用品', category: '公共采购', amount: 88.5, payer: '你', date: '9月6日', color: '#E9EEF9' },
  ],
  choreDone: false,
  paperRestocked: false,
  agreementConfirmed: false,
};

const avatars = [
  { name: '你', initials: 'QH', className: 'bg-[#D6EFE2] text-[#1F5B49]' },
  { name: 'Mia', initials: 'MI', className: 'bg-[#FCE5C8] text-[#80521D]' },
  { name: '阿杰', initials: 'AJ', className: 'bg-[#DFE6F5] text-[#425C8B]' },
  { name: '小林', initials: '林', className: 'bg-[#F4DDE5] text-[#814960]' },
];

const navItems = [
  { label: '首页', icon: House, active: true },
  { label: 'AA 账本', icon: ReceiptText },
  { label: '值日排班', icon: CalendarCheck2 },
  { label: '公共物品', icon: ShoppingBasket },
  { label: '室友公约', icon: BookOpenCheck },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [state, setState] = useState<RoomieState>(initialState);
  const [ready, setReady] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem('roomie-home-state');
        if (saved) setState(JSON.parse(saved));
      } catch {
        // Use the friendly demo data if browser storage is unavailable.
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem('roomie-home-state', JSON.stringify(state));
  }, [ready, state]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const householdSpend = useMemo(
    () => state.expenses.reduce((sum, item) => sum + item.amount, 0),
    [state.expenses],
  );

  function submitBill(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get('amount'));
    const titleValue = data.get('title');
    const payerValue = data.get('payer');
    const title = typeof titleValue === 'string' ? titleValue.trim() : '';
    const payer = typeof payerValue === 'string' ? payerValue : '你';
    if (!title || !amount || amount <= 0) return;

    setState((current) => ({
      ...current,
      expenses: [
        { id: Date.now(), title, category: '公共支出', amount, payer, date: '今天', color: '#E9F5E6' },
        ...current.expenses,
      ],
    }));
    setBillOpen(false);
    setToast(`已记账，每人 ¥${formatMoney(amount / 4)}`);
    event.currentTarget.reset();
  }

  function resetDemo() {
    setState(initialState);
    setToast('演示数据已恢复');
  }

  return (
    <main className="min-h-screen bg-[#F4F5EF] text-[#22312D]">
      <div className="mx-auto flex min-h-screen min-w-[1120px] max-w-[1600px]">
        <aside className="fixed inset-y-0 w-[244px] bg-[#183F35] px-5 py-7 text-white">
          <div className="flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded-[14px] bg-[#F3C66F] text-[#183F35] shadow-[0_8px_20px_rgba(0,0,0,.15)]">
              <House className="size-5" strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[21px] font-bold tracking-[-0.03em]">Roomie</div>
              <div className="mt-0.5 text-[10px] font-medium tracking-[0.16em] text-white/45">合租生活管家</div>
            </div>
          </div>

          <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.07] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-[0.14em] text-white/45">当前房间</span>
              <ChevronRight className="size-4 text-white/35" />
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-[#DDEBDF] text-lg">🌿</div>
              <div>
                <div className="text-sm font-semibold">梧桐公寓 302</div>
                <div className="mt-0.5 text-[11px] text-white/45">4 位室友</div>
              </div>
            </div>
          </div>

          <nav className="mt-7 space-y-1" aria-label="主导航">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] transition ${
                    item.active ? 'bg-white text-[#183F35] shadow-sm' : 'text-white/62 hover:bg-white/[0.07] hover:text-white'
                  }`}
                  onClick={() => !item.active && setToast(`${item.label}将在下一版开放`)}
                >
                  <Icon className="size-[18px]" strokeWidth={item.active ? 2.4 : 2} />
                  <span className="font-medium">{item.label}</span>
                  {item.active && <span className="ml-auto size-1.5 rounded-full bg-[#E9A93A]" />}
                </button>
              );
            })}
          </nav>

          <div className="absolute inset-x-5 bottom-6">
            <div className="mb-3 border-t border-white/10 pt-4">
              <button type="button" onClick={resetDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-white/45 transition hover:bg-white/[0.07] hover:text-white">
                <RotateCcw className="size-4" />
                恢复演示数据
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[#12342C] p-3">
              <Avatar className="size-9 border-0">
                <AvatarFallback className="bg-[#D6EFE2] text-xs font-bold text-[#1F5B49]">QH</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold">清豪</div>
                <div className="mt-0.5 text-[10px] text-white/40">房间成员</div>
              </div>
              <Settings className="size-4 text-white/35" />
            </div>
          </div>
        </aside>

        <section className="ml-[244px] min-w-0 flex-1">
          <header className="flex h-[78px] items-center justify-between border-b border-[#DDE1D8] bg-[#F8F8F4]/95 px-9">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-[#85918A]">2026年9月12日 · 星期六</p>
              <h1 className="mt-1 text-[20px] font-bold tracking-[-0.025em]">晚上好，清豪 👋</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-r border-[#D7DDD4] pr-5">
                <span className="text-[11px] text-[#7A8881]">室友在线</span>
                <AvatarGroup>
                  {avatars.map((avatar) => (
                    <Avatar key={avatar.name} size="sm" title={avatar.name}>
                      <AvatarFallback className={`${avatar.className} text-[9px] font-bold`}>{avatar.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
              <button type="button" aria-label="通知" onClick={() => setToast('今天没有新的通知')} className="relative grid size-9 place-items-center rounded-xl border border-[#D8DED5] bg-white text-[#65746D] transition hover:border-[#AEBBB4] hover:text-[#244A3F]">
                <Bell className="size-[17px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#E9A93A] ring-2 ring-white" />
              </button>
              <Button onClick={() => setBillOpen(true)} className="h-9 rounded-xl bg-[#1E4D40] px-4 text-xs text-white shadow-[0_6px_16px_rgba(30,77,64,.18)] hover:bg-[#173F35]">
                <Plus className="size-4" />
                记一笔
              </Button>
            </div>
          </header>

          <div className="px-9 py-7">
            <section className="relative overflow-hidden rounded-[22px] bg-[#214D41] px-7 py-6 text-white shadow-[0_18px_45px_rgba(27,67,56,.13)]">
              <div className="absolute -right-10 -top-20 size-56 rounded-full border-[34px] border-white/[0.04]" />
              <div className="absolute bottom-[-90px] right-44 size-44 rounded-full border-[26px] border-[#F2C66D]/[0.09]" />
              <div className="relative flex items-end justify-between gap-10">
                <div>
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white/70">
                    <Sparkles className="size-3 text-[#F5CD7D]" /> 今日生活概览
                  </div>
                  <h2 className="text-[25px] font-semibold tracking-[-0.035em]">家里一切井然有序</h2>
                  <p className="mt-2 max-w-[510px] text-[12px] leading-5 text-white/58">今天有 1 项值日待完成，2 件公共物品需要留意。晚饭后花几分钟处理一下吧。</p>
                </div>
                <div className="flex items-center gap-8 border-l border-white/10 pl-8">
                  <div><div className="text-[23px] font-semibold">3</div><div className="mt-1 text-[10px] text-white/45">本周已完成</div></div>
                  <div><div className="text-[23px] font-semibold text-[#F5CD7D]">2</div><div className="mt-1 text-[10px] text-white/45">待你处理</div></div>
                </div>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-4 gap-4">
              <StatCard icon={WalletCards} label="本月公共支出" value={`¥${formatMoney(householdSpend)}`} note="较上月节省 12%" tone="green" />
              <StatCard icon={CircleDollarSign} label="我的待支付" value="¥89.00" note="2 笔待结算" tone="yellow" />
              <StatCard icon={CalendarCheck2} label="本周值日" value={state.choreDone ? '4 / 4' : '3 / 4'} note={state.choreDone ? '本周任务全部完成' : '还有 1 项待完成'} tone="blue" />
              <StatCard icon={PackageOpen} label="需要补货" value={state.paperRestocked ? '1 件' : '2 件'} note="洗衣液 · 垃圾袋" tone="rose" />
            </section>

            <section className="mt-5 grid grid-cols-[1.18fr_.82fr] gap-5">
              <div className="space-y-5">
                <Panel title="最近账单" subtitle="本月公共支出记录" action="查看账本" onAction={() => setToast('完整账本将在下一版开放')}>
                  <div className="mt-4 divide-y divide-[#E9ECE6]">
                    {state.expenses.slice(0, 3).map((expense) => (
                      <div key={expense.id} className="flex items-center gap-3 py-3 first:pt-1">
                        <div className="grid size-9 place-items-center rounded-xl" style={{ background: expense.color }}><ReceiptText className="size-4 text-[#42584F]" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12px] font-semibold">{expense.title}</div>
                          <div className="mt-1 text-[10px] text-[#929D97]">{expense.payer} 垫付 · {expense.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[12px] font-semibold">¥{formatMoney(expense.amount)}</div>
                          <div className="mt-1 text-[10px] text-[#8B9690]">人均 ¥{formatMoney(expense.amount / 4)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="今日值日" subtitle="9月12日 · 公共区域" action="本周排班" onAction={() => setToast('本周还有 1 项待完成')}>
                  <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#E4E8E1] bg-[#F8F9F5] p-4">
                    <div className="grid size-11 place-items-center rounded-[14px] bg-[#DFEEE5] text-xl">🧹</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold">客厅地面清洁</span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${state.choreDone ? 'bg-[#DDEFE5] text-[#327158]' : 'bg-[#FFF0D8] text-[#966B25]'}`}>{state.choreDone ? '已完成' : '今天完成'}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#8A9690]"><Users className="size-3" /> 负责人：你 <span className="mx-1 text-[#CDD2CE]">·</span><Clock3 className="size-3" /> 预计 20 分钟</div>
                    </div>
                    <Button variant={state.choreDone ? 'outline' : 'default'} onClick={() => { setState((current) => ({ ...current, choreDone: !current.choreDone })); setToast(state.choreDone ? '已恢复为待完成' : '做得好，值日已完成'); }} className={state.choreDone ? 'h-8 rounded-lg border-[#D8DED8] bg-white px-3 text-[10px]' : 'h-8 rounded-lg bg-[#1E4D40] px-3 text-[10px] text-white hover:bg-[#173F35]'}>
                      {state.choreDone && <Check className="size-3.5" />}{state.choreDone ? '已完成' : '标记完成'}
                    </Button>
                  </div>
                </Panel>
              </div>

              <div className="space-y-5">
                <Panel title="补货提醒" subtitle="别让生活用品突然断档" action="物品清单" onAction={() => setToast('当前有 2 件物品需要留意')}>
                  <div className="mt-4 space-y-2.5">
                    <SupplyRow emoji="🧻" name="卷纸" status={state.paperRestocked ? '已补货' : '仅剩 1 卷'} urgent={!state.paperRestocked} action={state.paperRestocked ? '已完成' : '我来买'} onClick={() => { setState((current) => ({ ...current, paperRestocked: !current.paperRestocked })); setToast(state.paperRestocked ? '已重新加入补货提醒' : '卷纸已标记为补货完成'); }} />
                    <SupplyRow emoji="🧴" name="洗衣液" status="余量约 20%" urgent action="提醒阿杰" onClick={() => setToast('已提醒阿杰下班购买')} />
                    <SupplyRow emoji="🗑️" name="垃圾袋" status="余量充足" action="" />
                  </div>
                </Panel>

                <Panel title="最新公约" subtitle="共同确认，住得更舒服" action="全部公约" onAction={() => setToast('目前共有 6 条室友公约')}>
                  <div className="mt-4 rounded-2xl bg-[#FFF7E8] p-4">
                    <div className="flex items-center justify-between"><span className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-[#926824] shadow-sm">安静时间</span><span className="text-[9px] text-[#AA9470]">3 / 4 已确认</span></div>
                    <p className="mt-3 text-[12px] font-semibold leading-5 text-[#4A4336]">工作日晚上 11 点后，请降低音量并使用耳机。</p>
                    <div className="mt-3 flex items-center justify-between">
                      <AvatarGroup>{avatars.slice(1).map((avatar) => <Avatar key={avatar.name} size="sm"><AvatarFallback className={`${avatar.className} text-[8px] font-bold`}>{avatar.initials}</AvatarFallback></Avatar>)}</AvatarGroup>
                      <button type="button" onClick={() => { if (!state.agreementConfirmed) { setState((current) => ({ ...current, agreementConfirmed: true })); setToast('你已确认这条公约'); } }} className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition ${state.agreementConfirmed ? 'bg-[#DDEFE5] text-[#327158]' : 'bg-[#214D41] text-white hover:bg-[#173F35]'}`}>{state.agreementConfirmed ? '已确认 ✓' : '确认公约'}</button>
                    </div>
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        </section>
      </div>

      <Dialog open={billOpen} onOpenChange={setBillOpen}>
        <DialogContent className="max-w-[430px] rounded-[20px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-[-0.02em]">记一笔公共支出</DialogTitle>
            <DialogDescription>保存后会自动按 4 位室友平均分摊。</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBill} className="mt-1 space-y-4">
            <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-[#5F6E67]">账单名称</span><input name="title" required placeholder="例如：超市采购" className="h-10 w-full rounded-xl border border-[#D9DED8] bg-[#FAFBF8] px-3 text-sm outline-none transition focus:border-[#5C8175] focus:ring-2 focus:ring-[#DCEBE5]" /></label>
            <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-[#5F6E67]">总金额</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7E8A84]">¥</span><input name="amount" required min="0.01" step="0.01" type="number" placeholder="0.00" className="h-10 w-full rounded-xl border border-[#D9DED8] bg-[#FAFBF8] pl-8 pr-3 text-sm outline-none transition focus:border-[#5C8175] focus:ring-2 focus:ring-[#DCEBE5]" /></div></label>
            <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-[#5F6E67]">付款人</span><select name="payer" className="h-10 w-full rounded-xl border border-[#D9DED8] bg-[#FAFBF8] px-3 text-sm outline-none transition focus:border-[#5C8175] focus:ring-2 focus:ring-[#DCEBE5]"><option>你</option><option>Mia</option><option>阿杰</option><option>小林</option></select></label>
            <div className="rounded-xl bg-[#EDF4EF] px-3.5 py-3 text-[11px] leading-5 text-[#557067]">参与成员：你、Mia、阿杰、小林 · 4 人平均分摊</div>
            <DialogFooter className="-mx-6 -mb-6 mt-6 px-6 py-4"><Button type="button" variant="outline" onClick={() => setBillOpen(false)} className="h-9 rounded-xl px-4">取消</Button><Button type="submit" className="h-9 rounded-xl bg-[#1E4D40] px-5 text-white hover:bg-[#173F35]">保存并分摊</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {toast && <output className="fixed bottom-7 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#183F35] px-4 py-2.5 text-xs font-medium text-white shadow-[0_14px_40px_rgba(18,52,44,.28)]"><Check className="size-3.5 text-[#F2C66D]" />{toast}</output>}
    </main>
  );
}

function StatCard({ icon: Icon, label, value, note, tone }: { icon: typeof House; label: string; value: string; note: string; tone: 'green' | 'yellow' | 'blue' | 'rose' }) {
  const tones = { green: 'bg-[#E6F1E9] text-[#3D705C]', yellow: 'bg-[#FFF1D9] text-[#9A6B1F]', blue: 'bg-[#E7EDF8] text-[#526B9B]', rose: 'bg-[#F6E7EA] text-[#925569]' };
  return <div className="rounded-[18px] border border-[#E0E4DD] bg-[#FBFCF9] p-4 shadow-[0_6px_20px_rgba(44,61,54,.035)]"><div className="flex items-start justify-between"><div><p className="text-[10px] font-medium text-[#8A958F]">{label}</p><p className="mt-2 text-[20px] font-bold tracking-[-0.035em] text-[#293C35]">{value}</p></div><div className={`grid size-8 place-items-center rounded-[11px] ${tones[tone]}`}><Icon className="size-4" /></div></div><p className="mt-2 text-[9px] text-[#99A39E]">{note}</p></div>;
}

function Panel({ title, subtitle, action, onAction, children }: { title: string; subtitle: string; action: string; onAction: () => void; children: React.ReactNode }) {
  return <section className="rounded-[20px] border border-[#E0E4DD] bg-[#FBFCF9] p-5 shadow-[0_6px_22px_rgba(44,61,54,.035)]"><div className="flex items-center justify-between"><div><h3 className="text-[14px] font-bold tracking-[-0.015em]">{title}</h3><p className="mt-1 text-[10px] text-[#98A29D]">{subtitle}</p></div><button type="button" onClick={onAction} className="flex items-center gap-0.5 text-[10px] font-medium text-[#56776B] transition hover:text-[#1E4D40]">{action}<ChevronRight className="size-3" /></button></div>{children}</section>;
}

function SupplyRow({ emoji, name, status, urgent = false, action, onClick }: { emoji: string; name: string; status: string; urgent?: boolean; action: string; onClick?: () => void }) {
  return <div className="flex items-center gap-3 rounded-xl border border-[#EAEBE6] bg-[#FAFBF8] px-3 py-2.5"><span className="grid size-8 place-items-center rounded-lg bg-white text-base shadow-sm">{emoji}</span><div className="min-w-0 flex-1"><div className="text-[11px] font-semibold">{name}</div><div className={`mt-0.5 text-[9px] ${urgent ? 'text-[#B26D4B]' : 'text-[#9AA39F]'}`}>{status}</div></div>{action && <button type="button" onClick={onClick} className="rounded-lg border border-[#DCE2DB] bg-white px-2.5 py-1.5 text-[9px] font-semibold text-[#526D63] transition hover:border-[#AFC0B8] hover:bg-[#F1F6F2]">{action}</button>}</div>;
}
