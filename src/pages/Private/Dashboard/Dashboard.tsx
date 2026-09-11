import { Card, CardContent } from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

type DashboardMeta = {
  total: number;
  comprasMes: number;
  ventasHoy: number;
};

const summary = (meta: DashboardMeta) => [
  {
    label: "Total Productos",
    value: meta.total,
    color: "#1976d2",
    isMoney: false,
    icon: <Inventory2Icon />,
  },
  {
    label: "Compras Mes",
    value: meta.comprasMes,
    color: "#2e7d32",
    isMoney: true,
    icon: <ShoppingCartIcon />,
  },
  {
    label: "Ventas Hoy",
    value: meta.ventasHoy,
    color: "#ed6c02",
    isMoney: true,
    icon: <PointOfSaleIcon />,
  },
];

export default function Dashboard() {
  const meta: DashboardMeta = {
    total: 15,
    comprasMes: 2,
    ventasHoy: 0,
  };

  const items = summary(meta);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          margin: "10px",
          flexWrap: "wrap",
        }}
      >
        {items.map((item) => (
          <Card
            key={item.label}
            style={{
              minWidth: 160,
              flex: "1 1 160px",
            }}
          >
            <CardContent>
              {/* Icono */}
              <div
                style={{
                  color: item.color,
                  marginBottom: "8px",
                }}
              >
                {item.icon}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: "0.9rem",
                  color: item.color,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>

              {/* Valor */}
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                }}
              >
                {item.isMoney
                  ? `Q ${Number(item.value).toFixed(2)}`
                  : item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
