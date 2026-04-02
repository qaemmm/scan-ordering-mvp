import { Button, Card, Empty, Grid, Input, Space, Tag, Toast } from "antd-mobile";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { CartBar } from "../components/menu/CartBar";
import { CartDrawer } from "../components/menu/CartDrawer";
import { SpecAddonModal } from "../components/menu/SpecAddonModal";
import { getCartCount, getCartTotal, useCartStore } from "../state/cart";
import { useSessionStore } from "../state/session";
import type { AiRecommendResponse, MenuItem, MenuPayload } from "../types/domain";

export function MenuPage() {
  const navigate = useNavigate();
  const { storeId = "s_1001" } = useParams();
  const session = useSessionStore();
  const { items, addItem, changeQty, clear } = useCartStore();

  const [data, setData] = useState<MenuPayload>({ categories: [], items: [] });
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [specVisible, setSpecVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiRecommendResponse | null>(null);

  useEffect(() => {
    void (async () => {
      const payload = await api.get<MenuPayload>(`/api/stores/${storeId}/menu`);
      setData(payload);
      setActiveCategory(payload.categories[0]?.id ?? "");
    })();
  }, [storeId]);

  const menuById = useMemo(
    () => Object.fromEntries(data.items.map((item) => [item.id, item])) as Record<string, MenuItem>,
    [data.items],
  );

  const filtered = data.items.filter((item) => {
    const matchCategory = activeCategory ? item.categoryId === activeCategory : true;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const cartTotal = getCartTotal(items);
  const cartCount = getCartCount(items);
  const minAmount = 38;
  const canCheckout = cartCount > 0 && (session.mode !== "DELIVERY" || cartTotal >= minAmount);

  const onOpenSpec = (item: MenuItem) => {
    setCurrentItem(item);
    setModalKey((seed) => seed + 1);
    setSpecVisible(true);
  };

  const addByDefault = (item: MenuItem) => {
    const spec = item.specs[0];
    addItem({
      productId: item.id,
      productName: item.name,
      specId: spec.id,
      specName: spec.name,
      addonIds: [],
      addonNames: [],
      unitPrice: Number((item.basePrice + spec.delta).toFixed(2)),
    });
    Toast.show({ content: `已加入：${item.name}`, duration: 1000 });
  };

  const askAi = async (query: string) => {
    setAiLoading(true);
    try {
      const res = await api.post<AiRecommendResponse>("/api/ai/recommend", {
        storeId,
        mode: session.mode,
        query,
      });
      setAiResult(res);
    } catch (err) {
      Toast.show({ content: err instanceof Error ? err.message : "AI 推荐失败" });
    } finally {
      setAiLoading(false);
    }
  };

  const onAdd = (payload: {
    productId: string;
    productName: string;
    specId: string;
    specName: string;
    addonIds: string[];
    addonNames: string[];
    unitPrice: number;
  }) => {
    addItem(payload);
    Toast.show({ content: "已加入购物车", duration: 1000 });
    setSpecVisible(false);
  };

  return (
    <div className="mobile-page with-bottom-bar page-menu">
      <div className="hero-banner compact">
        <p className="hero-kicker">MENU</p>
        <h2>港味馄饨菜单</h2>
      </div>

      <Card title="AI 推荐助手">
        <Space direction="vertical" block>
          <Input
            placeholder="例如：两个人怎么点更稳妥？"
            value={aiInput}
            onChange={setAiInput}
            clearable
          />
          <div className="ai-entry-list">
            <button type="button" className="ai-entry-chip" onClick={() => void askAi("本店招牌是什么？")}>本店招牌是什么？</button>
            <button type="button" className="ai-entry-chip" onClick={() => void askAi("两个人怎么点更稳妥？")}>两个人怎么点更稳妥？</button>
            <button type="button" className="ai-entry-chip" onClick={() => void askAi("想吃清淡一点，推荐什么？")}>想吃清淡一点，推荐什么？</button>
          </div>
          <Button color="primary" loading={aiLoading} onClick={() => void askAi(aiInput)}>
            获取推荐
          </Button>
          {aiResult && (
            <div className="ai-result-box">
              <p>{aiResult.answer}</p>
              {aiResult.picks.map((pick) => {
                const item = menuById[pick.productId];
                if (!item) return null;
                return (
                  <div key={pick.productId} className="ai-pick-row">
                    <div>
                      <strong>{item.name}</strong>
                      <p className="muted" style={{ margin: 0 }}>{pick.reason}</p>
                    </div>
                    <Button size="small" fill="outline" onClick={() => addByDefault(item)}>
                      一键加购
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Space>
      </Card>

      <Card title="分类">
        <Space wrap>
          {data.categories.map((category) => (
            <Tag
              key={category.id}
              color={activeCategory === category.id ? "primary" : "default"}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Tag>
          ))}
        </Space>
      </Card>

      <Card title="搜索">
        <Input placeholder="搜索菜品" value={search} onChange={setSearch} clearable />
      </Card>

      {!filtered.length ? (
        <Empty description="当前分类暂无菜品" />
      ) : (
        <Grid columns={1} gap={12}>
          {filtered.map((item) => (
            <Grid.Item key={item.id}>
              <Card>
                <div className="menu-item">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-item-body">
                    <h4>{item.name}</h4>
                    <p className="muted">{item.tags.join(" · ")}</p>
                    <div className="row-between">
                      <strong>HK${item.basePrice.toFixed(2)}</strong>
                      <Button size="small" color="primary" onClick={() => onOpenSpec(item)}>
                        选规格
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Grid.Item>
          ))}
        </Grid>
      )}

      <CartBar
        count={cartCount}
        total={cartTotal}
        canCheckout={canCheckout}
        onOpen={() => setDrawerVisible(true)}
        onCheckout={() => navigate(`/store/${storeId}/checkout`)}
      />

      <CartDrawer
        visible={drawerVisible}
        items={items}
        onClose={() => setDrawerVisible(false)}
        onChangeQty={changeQty}
        onClear={clear}
      />

      <SpecAddonModal
        key={modalKey}
        visible={specVisible}
        item={currentItem}
        onClose={() => setSpecVisible(false)}
        onConfirm={onAdd}
      />
    </div>
  );
}
