import { useEffect, useMemo, useRef, useState } from "react";

const ASSET = (folder, file) => `/assets/${folder}/${file}`;
const CORE = "第一批_核心素材";
const DECOR = "第二批_装饰与功能素材";
const DOODLE = `${DECOR}/doodles`;

const people = [
  { id: "lin", name: "林晓", color: "pink", key: "key-pink 1.png" },
  { id: "chen", name: "陈默", color: "blue", key: "key-blue 1.png" },
  { id: "zhou", name: "周屿", color: "green", key: "key-green 1.png" },
];

const photos = [
  { id: "apartment", label: "客厅合照", src: ASSET(DECOR, "photo-apartment.webp") },
  { id: "city", label: "城市黄昏", src: ASSET(DECOR, "photo-city.webp") },
  { id: "cat", label: "小猫来访", src: ASSET(DECOR, "photo-cat.webp") },
];

const initialLayout = [
  { id: "header", x: 31.5, y: 6.4, w: 36.5, h: 19.5, r: 0 },
  { id: "photo-left", x: 5.5, y: 2.0, w: 20.0, h: 30.0, r: 6 },
  { id: "photo-right", x: 66.0, y: 2.2, w: 17.5, h: 26.25, r: -5 },
  { id: "keys", x: 84.0, y: 4.0, w: 13.4, h: 35.5, r: 0 },
  { id: "aa", x: 4.7, y: 31.2, w: 29.4, h: 30.5, r: 0 },
  { id: "today", x: 35.3, y: 36.5, w: 27.7, h: 51, r: 0 },
  { id: "chores", x: 63.5, y: 31.2, w: 25.6, h: 30.5, r: 1 },
  { id: "supplies", x: 4.7, y: 62.8, w: 29.4, h: 31.5, r: -1 },
  { id: "rules", x: 63.5, y: 62.8, w: 25.6, h: 31.5, r: -1 },
  { id: "quick", x: 89.6, y: 40.5, w: 8.1, h: 47.5, r: 0 },
  { id: "plant", x: 1.4, y: 74, w: 8.5, h: 13, r: -5, asset: ASSET(DECOR, "decor-potted-plant.png"), kind: "decor" },
  { id: "heart-doodle", x: 27, y: 25, w: 5, h: 5, r: -9, asset: ASSET(`${DOODLE}/black`, "heart.png"), kind: "decor" },
  { id: "star-doodle", x: 57, y: 8, w: 4.4, h: 4.4, r: 8, asset: ASSET(`${DOODLE}/black`, "star.png"), kind: "decor" },
];

const modules = {
  aa: { title: "AA 费用", icon: "icon-coins.png", tone: "paper-lined", detail: "把共同支出摊清楚，今天少一点尴尬。" },
  chores: { title: "清洁值日", icon: "icon-broom.png", tone: "paper-grid", detail: "轮到谁、做什么、有没有完成，一眼就知道。" },
  supplies: { title: "公共物品", icon: "icon-cart.png", tone: "paper-white", detail: "用完之前提醒，下一次采购不用再问一遍。" },
  rules: { title: "室友公约", icon: "icon-document.png", tone: "paper-cream", detail: "把共同认可的生活规则，放在大家都看得到的地方。" },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function DraggableItem({ item, editMode, selected, boardRef, onSelect, onMove, onClick, children }) {
  const dragRef = useRef(null);
  const handlePointerDown = (event) => {
    if (!editMode) return;
    event.stopPropagation();
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onSelect(item.id);
    dragRef.current = { startX: event.clientX, startY: event.clientY, rect, item };
  };
  const handlePointerMove = (event) => {
    if (!dragRef.current) return;
    const { startX, startY, rect, item: startItem } = dragRef.current;
    onMove(item.id, { x: clamp(startItem.x + ((event.clientX - startX) / rect.width) * 100, 0, 100 - startItem.w), y: clamp(startItem.y + ((event.clientY - startY) / rect.height) * 100, 0, 100 - startItem.h) });
  };
  return (
    <div
      className={`board-item ${selected ? "is-selected" : ""} ${editMode ? "is-editable" : ""}`}
      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, height: `${item.h}%`, transform: `rotate(${item.r || 0}deg)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => { dragRef.current = null; }}
      onPointerCancel={() => { dragRef.current = null; }}
      onClick={(event) => { event.stopPropagation(); onClick?.(item.id); }}
    >{children}</div>
  );
}

function Pin({ color = "blue", type = "pin" }) {
  const file = type === "paperclip" ? "paperclip.png" : type === "binder" ? "binder-clip.png" : `pin-${color}.png`;
  return <img className={`pin pin-${type}`} src={ASSET(DECOR, file)} alt="" />;
}

function Fastener({ item, fallback }) {
  if (!item?.fastener) return <Pin color={fallback} />;
  if (item.fastener === "paperclip") return <Pin type="paperclip" />;
  if (item.fastener === "binder") return <Pin type="binder" />;
  return <Pin color={item.fastener.replace("pin-", "")} />;
}

function ModulePaper({ moduleId, onOpen, onAction, activePerson, stockReady = modules[moduleId]?.stockReady || false }) {
  const module = modules[moduleId];
  return (
    <div className={`module-paper ${module.tone}`} onClick={() => onOpen(moduleId)}>
      <Fastener item={module} fallback={moduleId === "aa" ? "blue" : moduleId === "chores" ? "blue" : "pink"} />
      <div className={`module-safe module-safe-${moduleId}`}>
        <div className="paper-heading"><img src={ASSET(DECOR, module.icon)} alt="" /><h2>{module.title}</h2></div>
        {moduleId === "aa" && <div className="paper-content aa-content"><div className="data-row"><span>本月共同支出</span><strong>¥1,286.50</strong></div><div className="data-row highlight-row"><span>我的待补款</span><strong>¥86.40</strong></div><div className="data-row"><span>最近一笔　电费</span><strong>¥268.00</strong></div><button className="outline-button" onClick={(event) => { event.stopPropagation(); onAction("expense"); }}>2 笔待结算　→</button></div>}
        {moduleId === "chores" && <div className="paper-content chores-content"><div className="tag-line"><span>今日任务</span><b>清理厨房</b></div><div className="data-row"><span>负责人</span><strong className="name-tag blue-tag">林晓</strong></div><div className="next-task">下一个任务：周二 · 陈默 · 倒垃圾</div><button className="check-button" onClick={(event) => { event.stopPropagation(); onAction("chore"); }}><span className="check-box" />标记今天已完成</button></div>}
        {moduleId === "supplies" && <div className="paper-content supplies-content"><div className="data-row"><span>快用完</span><strong className={stockReady ? "blue-tag" : "pink-tag"}>{stockReady ? "已补货" : "卫生纸"}</strong></div><div className="data-row"><span>{stockReady ? "库存状态" : "已用完"}</span><strong className={stockReady ? "blue-tag" : "pink-tag"}>{stockReady ? "充足" : "垃圾袋"}</strong></div><div className="data-row"><span>待购买</span><strong className="blue-tag number-tag">{stockReady ? "0 件" : "2 件"}</strong></div><div className="last-update">最近更新：{stockReady ? "你 · 刚刚" : "周屿 · 昨晚"}</div><button className="mini-action" onClick={(event) => { event.stopPropagation(); onAction("stock"); }}>{stockReady ? "再次更新库存" : "补充库存"}</button></div>}
        {moduleId === "rules" && <div className="paper-content rules-content"><div className="data-row rule-row"><span>最新规则</span><strong className="pink-tag">留宿需提前说明</strong></div><div className="data-row"><span>更新时间</span><strong>9 月 11 日</strong></div><div className="data-row"><span>确认进度</span><strong className="blue-tag number-tag">2 / 3 人已确认</strong></div><div className="data-row"><span>当前用户状态</span><strong className="pink-tag">待确认</strong></div><button className="mini-action" onClick={(event) => { event.stopPropagation(); onAction("rule"); }}>确认公约</button></div>}
      </div>
    </div>
  );
}

function Polaroid({ photo, onChange, label = "换一张" }) {
  return <div className="polaroid" onClick={(event) => { event.stopPropagation(); onChange(); }}><div className="polaroid-card"><img className="polaroid-photo" src={photo.src} alt={photo.label} /><img className="polaroid-frame" src={ASSET(CORE, "polaroid-frame-v2.png")} alt="" /><span className="polaroid-hint">{label}</span></div></div>;
}

function HeaderNote() {
  return <div className="header-note"><div className="tape tape-pink" /><div className="header-brand">Roomie</div><div className="header-home">梧桐公寓 · 302</div><div className="header-date">2026 年 9 月 14 日 · 周一</div><div className="header-rule" aria-hidden="true" /></div>;
}

function KeyChain({ activePerson, onPersonChange }) {
  return <div className="key-chain" aria-label="室友视角切换"><img className="key-hook" src={ASSET(CORE, "key-hook-ring 1.png")} alt="" /><div className="key-list">{people.map((person) => <div className={`key-entry key-${person.color} ${activePerson === person.name ? "is-active" : ""}`} key={person.id}><img src={ASSET(CORE, person.key)} alt="" /><button className="key-hit" onClick={(event) => { event.stopPropagation(); onPersonChange(person.name); }} aria-label={`切换到${person.name}视角`}><span>{person.name}</span></button></div>)}</div><div className="key-caption">当前视角：{activePerson}</div></div>;
}

function QuickActions({ onAction }) {
  return <div className="quick-actions"><div className="quick-heading">快捷操作</div><button className="quick-button pink" onClick={() => onAction("expense")}><img src={ASSET(DECOR, "icon-coins.png")} alt="" />记一笔费用</button><button className="quick-button blue" onClick={() => onAction("chore")}><img src={ASSET(DECOR, "icon-broom.png")} alt="" />完成值日</button><button className="quick-button green" onClick={() => onAction("stock")}><img src={ASSET(DECOR, "icon-cart.png")} alt="" />补充库存</button><button className="quick-button purple" onClick={() => onAction("rule")}><img src={ASSET(DECOR, "icon-document.png")} alt="" />查看公约</button></div>;
}

function TodayNote({ item, done, onToggle, onOpen }) {
  const tasks = [{ id: "expense", text: "向陈默补款", meta: "¥86.40", action: "expense" }, { id: "chore", text: "今天由林晓清理厨房", meta: "", action: "chore" }, { id: "stock", text: "卫生纸和垃圾袋需要补货", meta: "", action: "stock" }];
  return <div className="today-note" onClick={() => onOpen("today")}><Fastener item={item} fallback="red" /><div className="today-heading"><span>今天有</span><strong>3</strong><span>件事</span></div><div className="today-list">{tasks.map((task) => <button className={`today-task ${done[task.id] ? "is-done" : ""}`} key={task.id} onClick={(event) => { event.stopPropagation(); onToggle(task.id, task.action); }}><span className="task-checkbox">{done[task.id] ? "✓" : ""}</span><span>{task.text}</span>{task.meta && <b>{task.meta}</b>}</button>)}</div><button className="today-cta" onClick={(event) => { event.stopPropagation(); onOpen("today"); }}>立即处理　→</button><div className="smile-mark">☺</div></div>;
}

function Modal({ moduleId, onClose, onAction, expenses, activePerson }) {
  if (!moduleId) return null;
  const module = moduleId === "today" ? { title: "今天要处理", detail: "把今天的三件小事，一件一件完成。", icon: "icon-document.png" } : modules[moduleId];
  return <div className="modal-backdrop" onClick={onClose}><section className="detail-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>关闭</button><div className="modal-topline"><img src={ASSET(DECOR, module.icon)} alt="" /><div><div className="modal-eyebrow">ROOMIE · 梧桐公寓 302</div><h2>{module.title}</h2></div></div><p className="modal-detail">{module.detail}</p>{moduleId === "today" && <div className="modal-list"><div><span className="modal-dot pink-dot" />向陈默补款 <b>¥86.40</b><button onClick={() => onAction("expense")}>去处理</button></div><div><span className="modal-dot blue-dot" />林晓 · 清理厨房 <button onClick={() => onAction("chore")}>标记完成</button></div><div><span className="modal-dot green-dot" />卫生纸和垃圾袋补货 <button onClick={() => onAction("stock")}>更新库存</button></div></div>}{moduleId === "aa" && <div className="modal-list"><div className="modal-stat"><span>本月共同支出</span><strong>¥1,286.50</strong></div><div className="modal-stat"><span>当前 {activePerson} 待补款</span><strong className="pink-number">¥86.40</strong></div><div className="modal-note">最近一笔：电费 · ¥268.00 · 林晓先付</div><button className="modal-primary" onClick={() => onAction("expense")}>新增一笔费用</button></div>}{moduleId === "chores" && <div className="modal-list"><div className="modal-stat"><span>今天</span><strong>林晓 · 清理厨房</strong></div><div className="modal-stat"><span>周二</span><strong>陈默 · 倒垃圾</strong></div><button className="modal-primary" onClick={() => onAction("chore")}>标记今天已完成</button></div>}{moduleId === "supplies" && <div className="modal-list"><div className="modal-stat"><span>快用完</span><strong>卫生纸</strong></div><div className="modal-stat"><span>已用完</span><strong>垃圾袋</strong></div><div className="modal-note">待购买 2 件 · 最近更新：周屿 · 昨晚</div><button className="modal-primary" onClick={() => onAction("stock")}>标记已补货</button></div>}{moduleId === "rules" && <div className="modal-list"><div className="modal-stat"><span>最新规则</span><strong>访客留宿请提前说明</strong></div><div className="modal-stat"><span>确认进度</span><strong>2 / 3 人已确认</strong></div><button className="modal-primary" onClick={() => onAction("rule")}>确认我已阅读</button></div>}{expenses.length > 0 && moduleId === "aa" && <div className="expense-history">本次演示新增：{expenses[expenses.length - 1].name} · ¥{expenses[expenses.length - 1].amount}</div>}</section></div>;
}

function ExpenseForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("周末公共采购");
  const [amount, setAmount] = useState("128");
  return <div className="modal-backdrop" onClick={onCancel}><section className="expense-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onCancel}>取消</button><div className="modal-eyebrow">记录一笔共同支出</div><h2>把这笔费用放上公告板</h2><label>费用名称<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>金额<input type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><button className="modal-primary" onClick={() => onSubmit({ name, amount: Number(amount || 0).toFixed(2) })}>保存费用</button></section></div>;
}

function MaterialTray({ selectedItem, onAdd, onFastener, onPhotoAdd, onDelete, onClose, onReset }) {
  const doodles = [["heart", ASSET(`${DOODLE}/pink`, "heart.png")], ["star", ASSET(`${DOODLE}/black`, "star.png")], ["arrow", ASSET(`${DOODLE}/blue`, "arrow.png")], ["sparkle", ASSET(`${DOODLE}/blue`, "sparkle.png")]];
  return <div className="material-tray"><div className="tray-head"><div><span className="tray-kicker">EDIT MODE</span><strong>装饰你的公告板</strong></div><div className="tray-actions"><button onClick={onReset}>恢复默认布局</button><button className="tray-cancel" onClick={onClose}>完成编辑</button></div></div><div className="tray-columns"><div className="tray-group"><span className="tray-label">图钉与夹子</span><div className="material-row pin-row"><button onClick={() => onFastener("pin-red")}><Pin color="red" /></button><button onClick={() => onFastener("pin-blue")}><Pin color="blue" /></button><button onClick={() => onFastener("pin-pink")}><Pin color="pink" /></button><button onClick={() => onFastener("paperclip")}><Pin type="paperclip" /></button><button onClick={() => onFastener("binder")}><Pin type="binder" /></button></div></div><div className="tray-group"><span className="tray-label">涂鸦贴纸</span><div className="material-row doodle-row">{doodles.map(([name, src]) => <button key={name} onClick={() => onAdd({ name, asset: src, kind: "decor" })}><img src={src} alt={name} /></button>)}</div></div><div className="tray-group"><span className="tray-label">拍立得</span><div className="material-row photo-row">{photos.map((photo) => <button key={photo.id} onClick={() => onPhotoAdd(photo)}><img src={photo.src} alt={photo.label} /></button>)}</div></div><div className="tray-group tray-delete"><span className="tray-label">当前选中</span><div className="selected-name">{selectedItem?.id || "点击板上物件"}</div><button onClick={onDelete} disabled={!selectedItem || selectedItem.kind !== "decor"}>删除装饰</button></div></div></div>;
}

export function App() {
  const boardRef = useRef(null);
  const [layout, setLayout] = useState(() => { try { return JSON.parse(localStorage.getItem("roomie-layout-v8")) || initialLayout; } catch { return initialLayout; } });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activePerson, setActivePerson] = useState("林晓");
  const [activeModule, setActiveModule] = useState(null);
  const [expenseForm, setExpenseForm] = useState(false);
  const [expenses, setExpenses] = useState(() => { try { return JSON.parse(localStorage.getItem("roomie-expenses-v1")) || []; } catch { return []; } });
  const [done, setDone] = useState(() => { try { return JSON.parse(localStorage.getItem("roomie-done-v1")) || {}; } catch { return {}; } });
  const [stockReady, setStockReady] = useState(false);
  const [toast, setToast] = useState("");
  const selectedItem = useMemo(() => layout.find((item) => item.id === selectedId), [layout, selectedId]);
  useEffect(() => { localStorage.setItem("roomie-layout-v8", JSON.stringify(layout)); }, [layout]);
  useEffect(() => { localStorage.setItem("roomie-expenses-v1", JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem("roomie-done-v1", JSON.stringify(done)); }, [done]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(""), 2200); return () => clearTimeout(timer); }, [toast]);
  const updateItem = (id, patch) => setLayout((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const notify = (message) => setToast(message);
  const completeTask = (id, action) => { const taskAction = action || id; if (taskAction === "stock") { setStockReady(true); notify("库存已更新，卫生纸和垃圾袋已标记为补货"); return; } if (taskAction === "chore") { setDone((state) => ({ ...state, chore: !state.chore })); notify(done.chore ? "已恢复为待处理" : "值日已完成，辛苦了！"); return; } if (taskAction === "rule") { setDone((state) => ({ ...state, rule: true })); notify("已记录你确认过这条公约"); return; } if (taskAction === "expense") setExpenseForm(true); };
  const openModule = (moduleId) => { if (editMode) { setSelectedId(moduleId); return; } setActiveModule(moduleId); };
  const handleQuickAction = (action) => { if (action === "expense") setExpenseForm(true); else if (action === "chore") setActiveModule("chores"); else if (action === "stock") setActiveModule("supplies"); else setActiveModule("rules"); };
  const handlePhotoChange = () => { setPhotoIndex((index) => (index + 1) % photos.length); notify(`拍立得已换成：${photos[(photoIndex + 1) % photos.length].label}`); };
  const enterEdit = () => { setEditMode(true); setSelectedId(null); notify("编辑模式已开启：拖动板块，或从底部素材库添加装饰"); };
  const exitEdit = () => { setEditMode(false); setSelectedId(null); notify("公告板布局已保存"); };
  const resetLayout = () => { Object.values(modules).forEach((module) => { delete module.fastener; }); setLayout(initialLayout); setSelectedId(null); notify("已恢复参考图的默认排布"); };
  const addDecor = ({ name, asset, kind = "decor" }) => { const id = `${name}-${Date.now()}`; const item = { id, x: 43 + ((layout.length * 7) % 18), y: 28 + ((layout.length * 5) % 24), w: 7, h: 7, r: (layout.length % 2 ? -8 : 7), asset, kind }; setLayout((items) => [...items, item]); setSelectedId(id); notify("素材已贴到公告板，可以继续拖动"); };
  const addPhoto = (photo) => { const id = `photo-${photo.id}-${Date.now()}`; setLayout((items) => [...items, { id, x: 42, y: 19, w: 13, h: 16, r: -4, asset: photo.src, photo: true, kind: "decor" }]); setSelectedId(id); notify(`已添加拍立得：${photo.label}`); };
  const setFastener = (type) => { if (!selectedItem) { notify("先点击一张纸片，再更换它的固定方式"); return; } if (modules[selectedItem.id]) modules[selectedItem.id].fastener = type; updateItem(selectedItem.id, { fastener: type }); notify("固定方式已更换"); };
  const deleteSelected = () => { if (!selectedItem || selectedItem.kind !== "decor") return; setLayout((items) => items.filter((item) => item.id !== selectedItem.id)); setSelectedId(null); notify("装饰已移除"); };
  const saveExpense = (expense) => { setExpenses((items) => [...items, expense]); setExpenseForm(false); notify(`已记录 ${expense.name} · ¥${expense.amount}`); };
  const getItem = (id) => layout.find((item) => item.id === id) || initialLayout.find((item) => item.id === id);
  modules.supplies.stockReady = stockReady;

  return <div className={`app-shell ${editMode ? "editing" : ""}`}><div className="top-rail"><span className="rail-dot" /><span>ROOMIE / 梧桐公寓共享板</span><span className="rail-note">{editMode ? "正在编辑公告板" : `今天是周一 · ${activePerson} 的视角`}</span></div><main className="page-wrap"><section className="board-stage" ref={boardRef} aria-label="Roomie 公寓公告板"><div className="cork-surface" /><div className="board-content"><DraggableItem item={getItem("header")} editMode={editMode} selected={selectedId === "header"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => setSelectedId("header")}><HeaderNote /></DraggableItem><DraggableItem item={getItem("photo-left")} editMode={editMode} selected={selectedId === "photo-left"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => editMode ? setSelectedId("photo-left") : handlePhotoChange()}><Polaroid photo={photos[photoIndex]} onChange={handlePhotoChange} /></DraggableItem><DraggableItem item={getItem("photo-right")} editMode={editMode} selected={selectedId === "photo-right"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => editMode ? setSelectedId("photo-right") : handlePhotoChange()}><Polaroid photo={photos[(photoIndex + 1) % photos.length]} onChange={handlePhotoChange} /></DraggableItem><DraggableItem item={getItem("keys")} editMode={false} selected={false} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem}><KeyChain activePerson={activePerson} onPersonChange={(person) => { setActivePerson(person); notify(`已切换到${person}的视角`); }} /></DraggableItem><DraggableItem item={getItem("aa")} editMode={editMode} selected={selectedId === "aa"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => openModule("aa")}><ModulePaper moduleId="aa" onOpen={openModule} onAction={completeTask} activePerson={activePerson} /></DraggableItem><DraggableItem item={getItem("today")} editMode={editMode} selected={selectedId === "today"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => openModule("today")}><TodayNote item={getItem("today")} done={{ ...done, stock: stockReady }} onToggle={completeTask} onOpen={openModule} /></DraggableItem><DraggableItem item={getItem("chores")} editMode={editMode} selected={selectedId === "chores"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => openModule("chores")}><ModulePaper moduleId="chores" onOpen={openModule} onAction={completeTask} activePerson={activePerson} /></DraggableItem><DraggableItem item={getItem("supplies")} editMode={editMode} selected={selectedId === "supplies"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => openModule("supplies")}><ModulePaper moduleId="supplies" onOpen={openModule} onAction={completeTask} activePerson={activePerson} /></DraggableItem><DraggableItem item={getItem("rules")} editMode={editMode} selected={selectedId === "rules"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => openModule("rules")}><ModulePaper moduleId="rules" onOpen={openModule} onAction={completeTask} activePerson={activePerson} /></DraggableItem><DraggableItem item={getItem("quick")} editMode={editMode} selected={selectedId === "quick"} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => setSelectedId("quick")}><QuickActions onAction={handleQuickAction} /></DraggableItem>{layout.filter((item) => item.kind === "decor").map((item) => <DraggableItem key={item.id} item={item} editMode={editMode} selected={selectedId === item.id} boardRef={boardRef} onSelect={setSelectedId} onMove={updateItem} onClick={() => setSelectedId(item.id)}>{item.photo ? <Polaroid photo={{ src: item.asset, label: "拍立得" }} onChange={() => editMode ? setSelectedId(item.id) : undefined} label={editMode ? "" : "换一张"} /> : <img className="decor-image" src={item.asset} alt="" />}</DraggableItem>)}</div><img className="wood-frame" src={ASSET(CORE, "board-wood-frame 1.png")} alt="" /><div className="board-edition-button"><button onClick={() => editMode ? exitEdit() : enterEdit()}>{editMode ? "完成编辑" : "编辑公告板"}</button></div></section>{editMode && <MaterialTray selectedItem={selectedItem} onAdd={addDecor} onFastener={setFastener} onPhotoAdd={addPhoto} onDelete={deleteSelected} onClose={exitEdit} onReset={resetLayout} />}</main><footer className="footer-note"><span>在同一块板上，把费用、家务和生活碎片放在一起。</span><span>数据保存在当前浏览器</span></footer>{toast && <div className="toast" role="status">{toast}</div>}<Modal moduleId={activeModule} onClose={() => setActiveModule(null)} onAction={(action) => { if (action === "expense") { setActiveModule(null); setExpenseForm(true); } else { completeTask(action, action); setActiveModule(null); } }} expenses={expenses} activePerson={activePerson} />{expenseForm && <ExpenseForm onSubmit={saveExpense} onCancel={() => setExpenseForm(false)} />}</div>;
}
