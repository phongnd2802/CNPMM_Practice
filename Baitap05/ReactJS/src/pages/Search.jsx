// frontend/src/pages/Search.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Pagination,
  Row,
  Select,
  Skeleton,
  Slider,
  Switch,
  notification,
} from "antd";
import { getCategoriesApi, searchProductsApi } from "../util/api.js";
import ProductCard from "../components/ProductCard.jsx";

const PAGE_SIZE = 8;
const formatVND = (v) => (v ?? 0).toLocaleString("vi-VN") + " đ";

export default function SearchPage() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    items: [],
    totalItems: 0,
    loading: false,
  });

  useEffect(() => {
    (async () => {
      const res = await getCategoriesApi();
      if (res?.EC === 0) setCategories(res.DT || []);
    })();
  }, []);

  const submit = async (p = 1) => {
    setState((s) => ({ ...s, loading: true }));
    const v = form.getFieldsValue(true);
    const params = {
      q: v.q,
      categoryId: v.categoryId,
      priceMin: v.price?.[0],
      priceMax: v.price?.[1],
      // ✅ chỉ gửi khi true (không gửi false)
      promoted: v.isPromoted ? true : undefined,
      minViews: v.minViews,
      sort: v.sort,
      page: p,
      limit: PAGE_SIZE,
    };
    const res = await searchProductsApi(params);
    if (res?.EC === 0) {
      setState({
        items: res.DT.items || [],
        totalItems: res.DT.totalItems || 0,
        loading: false,
      });
    } else {
      notification.error({
        message: "Search",
        description: res?.EM || "Search failed",
      });
      setState((s) => ({ ...s, loading: false }));
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      price: [0, 30_000_000],
      sort: "relevance",
      isPromoted: false, // mặc định OFF
      minViews: 0,
    });
    submit(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounce = (fn, ms = 400) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  };
  const onQueryChange = useMemo(
    () =>
      debounce(() => {
        setPage(1);
        submit(1);
      }, 500),
    []
  );

  const price = Form.useWatch("price", form) || [0, 30_000_000];

  const setPrice = (min, max) => {
    const newMin = Math.max(0, Math.min(min ?? 0, max ?? 0));
    const newMax = Math.max(newMin, max ?? newMin);
    form.setFieldsValue({ price: [newMin, newMax] });
  };

  return (
    <div className="container">
      <h2>Tìm kiếm sản phẩm</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          setPage(1);
          submit(1);
        }}
        onValuesChange={(changed) => {
          if (!("q" in changed)) {
            setPage(1);
            submit(1);
          }
        }}
      >
        <Row gutter={12}>
          <Col xs={24} md={6}>
            <Form.Item name="q" label="Từ khóa">
              <Input
                placeholder="Tên sản phẩm"
                onChange={onQueryChange}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={3}>
            <Form.Item name="categoryId" label="Danh mục">
              <Select
                allowClear
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                placeholder="Tất cả"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="price" label="Khoảng giá (đ)">
              <>
                <Slider
                  range
                  step={50_000}
                  min={0}
                  max={50_000_000}
                  value={price}
                  onChange={(val) => form.setFieldsValue({ price: val })}
                  tooltip={{ formatter: (v) => formatVND(v) }}
                />

                <div className="price-inline">
                  <InputNumber
                    min={0}
                    max={price?.[1] ?? 50_000_000}
                    value={price?.[0]}
                    onChange={(val) => setPrice(val, price?.[1])}
                    formatter={(v) => formatVND(v)}
                    parser={(v) => Number(String(v).replace(/[^\d]/g, ""))}
                    style={{ width: 180 }}
                  />
                  <span className="price-sep">—</span>
                  <InputNumber
                    min={price?.[0] ?? 0}
                    max={50_000_000}
                    value={price?.[1]}
                    onChange={(val) => setPrice(price?.[0], val)}
                    formatter={(v) => formatVND(v)}
                    parser={(v) => Number(String(v).replace(/[^\d]/g, ""))}
                    style={{ width: 180 }}
                  />
                </div>

                <div className="price-detail">
                  {formatVND(price?.[0])} &nbsp;–&nbsp; {formatVND(price?.[1])}
                </div>
              </>
            </Form.Item>
          </Col>

          <Col xs={12} md={3}>
            <Form.Item
              name="isPromoted"
              label="Khuyến mãi"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col xs={12} md={3}>
            <Form.Item name="sort" label="Sắp xếp">
              <Select
                options={[
                  { value: "relevance", label: "Liên quan" },
                  { value: "price_asc", label: "Giá tăng dần" },
                  { value: "price_desc", label: "Giá giảm dần" },
                  { value: "views_desc", label: "Lượt xem nhiều" },
                  { value: "newest", label: "Mới nhất" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={24} md={6} lg={4}>
            <Form.Item
              style={{ marginTop: 4, marginBottom: 0, textAlign: "center" }}
            >
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        {(state.loading ? Array.from({ length: PAGE_SIZE }) : state.items).map(
          (p, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p?.id || i}>
              {state.loading ? <Skeleton active /> : <ProductCard p={p} />}
            </Col>
          )
        )}
      </Row>

      {!state.loading && state.items.length === 0 && (
        <Empty style={{ marginTop: 24 }} />
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={state.totalItems}
          onChange={(p) => {
            setPage(p);
            submit(p);
          }}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
