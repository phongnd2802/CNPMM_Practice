import { Badge, Card, Tag, Tooltip } from "antd";

const VND = (n) => Intl.NumberFormat("vi-VN").format(n) + " đ";

export default function ProductCard({ p }) {
  const hasDiscount = Number(p?.discountPercent || 0) > 0;
  const finalPrice = hasDiscount
    ? (Number(p.price) * (100 - Number(p.discountPercent))) / 100
    : Number(p.price);

  return (
    <Badge.Ribbon
      text={p.isPromoted ? "Khuyến mãi" : null}
      color="red"
      placement="start"
    >
      <Card
        className="product-card"
        hoverable
        cover={
          p.imageUrl ? (
            <img
              className="product-img"
              alt={p.name}
              src={p.imageUrl}
              loading="lazy"
            />
          ) : null
        }
      >
        <div className="product-title" title={p.name}>
          {p.name}
        </div>

        <div className="product-prices">
          {hasDiscount ? (
            <>
              <span className="price-discount">{VND(finalPrice)}</span>
              <span className="price-original">{VND(p.price)}</span>
              <Tag color="green">-{p.discountPercent}%</Tag>
            </>
          ) : (
            <span className="price-normal">{VND(p.price)}</span>
          )}
        </div>

        <Tooltip title="Lượt xem">
          <div className="product-views">👁 {p.views ?? 0}</div>
        </Tooltip>
      </Card>
    </Badge.Ribbon>
  );
}
