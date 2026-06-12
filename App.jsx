import React, { useState, useMemo } from "react";

/* ============================================================
   THEME
============================================================ */
const C = {
  peachDark: "#F4B183",
  peachMed: "#F8CBAD",
  peachLight: "#FCE4D6",
  peachLighter: "#FDF2EC",
  textDark: "#7F4A24",
  accent: "#C55A11",
  good: "#2E7D32",
  bad: "#C62828",
};

const fmt = (n) =>
  "Rp " + (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("id-ID");
const pct = (n) => `${(Number.isFinite(n) ? n * 100 : 0).toFixed(1)}%`;

/* ============================================================
   GENERIC UI PIECES
============================================================ */
function Card({ title, sub, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {title && (
        <div style={{ marginBottom: sub ? 2 : 14 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: C.textDark,
            }}
          >
            {title}
          </h2>
        </div>
      )}
      {sub && (
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#888" }}>
          {sub}
        </p>
      )}
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "number", suffix, hint, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "#5a4a3a",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={selectStyle}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) =>
              onChange(
                type === "number" ? Number(e.target.value) : e.target.value
              )
            }
            style={inputStyle}
          />
        )}
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: "#aaa",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid #e6d4c3",
  background: C.peachLighter,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };

function Result({ label, value, big, status }) {
  const color =
    status === "good" ? C.good : status === "bad" ? C.bad : C.textDark;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: big ? "10px 0" : "6px 0",
        borderBottom: "1px solid #f3e6d8",
      }}
    >
      <span style={{ fontSize: big ? 14 : 13, color: "#7a6a5a" }}>{label}</span>
      <span
        style={{
          fontSize: big ? 20 : 15,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Bar({ label, planned, goalLabel, ok, value }) {
  const pctVal = Math.min(Math.abs(planned) * 100, 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        <span style={{ fontWeight: 600, color: "#5a4a3a" }}>{label}</span>
        <span style={{ color: ok ? C.good : C.bad, fontWeight: 600 }}>
          {value} <span style={{ color: "#aaa", fontWeight: 400 }}>({goalLabel})</span>
        </span>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 6,
          background: C.peachLighter,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pctVal}%`,
            background: ok ? C.good : C.peachDark,
            borderRadius: 6,
            transition: "width .3s",
          }}
        />
      </div>
    </div>
  );
}

function Banner({ children }) {
  return (
    <div
      style={{
        background: C.peachDark,
        color: "#5A2D0C",
        fontWeight: 700,
        padding: "10px 16px",
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function NoteBox({ children }) {
  return (
    <div
      style={{
        background: C.peachLighter,
        border: `1px solid ${C.peachDark}`,
        borderRadius: 8,
        padding: "12px 16px",
        fontSize: 12.5,
        color: "#7F4A24",
        fontStyle: "italic",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   MAIN APP
============================================================ */
const MENU = [
  { id: "konsep", label: "0. Konsep Dasar" },
  { id: "checkup", label: "1. Financial Check-Up" },
  { id: "anggaran", label: "2. Anggaran Bulanan" },
  { id: "darurat", label: "3. Dana Darurat" },
  { id: "investasi", label: "4. Investasi Syariah" },
  { id: "pensiun", label: "5. Dana Pensiun" },
  { id: "takaful", label: "6. Proteksi Takaful" },
  { id: "ziswaf", label: "7. Pemurnian ZISWAF" },
  { id: "akumulasi", label: "8. Akumulasi Kekayaan" },
  { id: "ringkasan", label: "9. Ringkasan & Aksi" },
  { id: "dashboard", label: "10. Breakdown Dashboard" },
];

export default function App() {
  const [active, setActive] = useState("konsep");

  /* ---------------- STATE: SHEET 0 ---------------- */
  const [tvm, setTvm] = useState({ pv: 1000000, rate: 0.05, years: 1 });
  const [reflect, setReflect] = useState({ a: "", b: "", c: "", d: "" });

  /* ---------------- STATE: SHEET 1 ---------------- */
  const [assets, setAssets] = useState({
    kas: 0,
    deposito: 0,
    reksadana: 0,
    saham: 0,
    emas: 0,
    kendaraan: 0,
    gadget: 0,
  });
  const [liabilities, setLiabilities] = useState({
    pendek: 0,
    panjang: 0,
    lainnya: 0,
  });

  /* ---------------- STATE: SHEET 2 ---------------- */
  const [income, setIncome] = useState({ gaji: 0, lain: 0 });
  const [spending, setSpending] = useState({
    zis: 0,
    investasi: 0,
    cicilan: 0,
    kebutuhan: 0,
    keinginan: 0,
  });

  /* ---------------- STATE: SHEET 3 ---------------- */
  const [darurat, setDarurat] = useState({
    faktor: 6,
    dimiliki: 0,
    sisihkan: 0,
  });

  /* ---------------- STATE: SHEET 4 ---------------- */
  const [investRows, setInvestRows] = useState(
    Array.from({ length: 5 }, () => ({
      tujuan: "",
      jangka: "Pendek (< 1 th)",
      target: 0,
      instrumen: "",
      risiko: "Rendah",
      setoran: 0,
      returnRate: "",
    }))
  );

  /* ---------------- STATE: SHEET 5 ---------------- */
  const [pensiun, setPensiun] = useState({
    usiaSekarang: 22,
    usiaPensiun: 56,
    usiaHidup: 75,
    pengeluaran: 5000000,
    setoran: 0,
    skema: "",
  });

  /* ---------------- STATE: SHEET 6 ---------------- */
  const [takaful, setTakaful] = useState(
    ["Jiwa", "Kesehatan", "Kecelakaan", "Pendidikan anak", "Aset/Properti"].map(
      (r) => ({
        risiko: r,
        produk: "",
        pertanggungan: 0,
        premi: 0,
        status: "Belum",
      })
    )
  );

  /* ---------------- STATE: SHEET 7 ---------------- */
  const [ziswaf, setZiswaf] = useState({
    hartaWajib: 0,
    zakatPenghasilan: 0,
    infaq: 0,
    wakaf: 0,
    nonHalal: 0,
  });

  /* ---------------- STATE: SHEET 8 ---------------- */
  const [akumulasi, setAkumulasi] = useState(
    ["Emas / Logam Mulia", "Properti", "Bisnis / Usaha", "Lainnya"].map(
      (i) => ({
        instrumen: i,
        target: 0,
        alokasi: 0,
        growth: "",
        risiko: "Rendah",
        catatan: "",
      })
    )
  );

  /* ---------------- STATE: SHEET 9 ---------------- */
  const [aksi, setAksi] = useState({
    pendek: "",
    pendekDeadline: "",
    menengah: "",
    menengahDeadline: "",
    panjang: "",
    panjangDeadline: "",
  });

  /* ============================================================
     CALCULATIONS
  ============================================================ */
  const totalAset = useMemo(
    () => Object.values(assets).reduce((a, b) => a + (Number(b) || 0), 0),
    [assets]
  );
  const totalLiab = useMemo(
    () => Object.values(liabilities).reduce((a, b) => a + (Number(b) || 0), 0),
    [liabilities]
  );
  const netWorth = totalAset - totalLiab;

  const totalIncome = (income.gaji || 0) + (income.lain || 0);
  const totalSpending = useMemo(
    () => Object.values(spending).reduce((a, b) => a + (Number(b) || 0), 0),
    [spending]
  );
  const surplus = totalIncome - totalSpending;

  const ratioLikuiditas = totalSpending
    ? (assets.kas + assets.deposito) / totalSpending
    : 0;
  const ratioMenabung = totalIncome ? spending.investasi / totalIncome : 0;
  const ratioUtangAset = totalAset ? totalLiab / totalAset : 0;
  const ratioCicilan = totalIncome ? spending.cicilan / totalIncome : 0;

  const pctOf = (val) => (totalIncome ? val / totalIncome : 0);

  const targetDarurat = totalSpending * darurat.faktor;
  const kekuranganDarurat = Math.max(targetDarurat - darurat.dimiliki, 0);
  const waktuDarurat =
    darurat.sisihkan > 0 ? Math.ceil(kekuranganDarurat / darurat.sisihkan) : 0;

  const fv = tvm.pv * Math.pow(1 + tvm.rate, tvm.years);

  const totalSetoranInvest = investRows.reduce(
    (a, r) => a + (Number(r.setoran) || 0),
    0
  );
  const totalTargetInvest = investRows.reduce(
    (a, r) => a + (Number(r.target) || 0),
    0
  );

  const masaMenabung = pensiun.usiaPensiun - pensiun.usiaSekarang;
  const masaPensiun = pensiun.usiaHidup - pensiun.usiaPensiun;
  const kebutuhanPensiun = pensiun.pengeluaran * 12 * Math.max(masaPensiun, 0);

  const zakatMaal = ziswaf.hartaWajib * 0.025;
  const totalPemurnian =
    zakatMaal +
    (ziswaf.zakatPenghasilan || 0) +
    (ziswaf.infaq || 0) +
    (ziswaf.wakaf || 0) +
    (ziswaf.nonHalal || 0);

  const totalTargetAkumulasi = akumulasi.reduce(
    (a, r) => a + (Number(r.target) || 0),
    0
  );
  const totalAlokasiAkumulasi = akumulasi.reduce(
    (a, r) => a + (Number(r.alokasi) || 0),
    0
  );

  /* ============================================================
     RENDER HELPERS PER SECTION
  ============================================================ */
  function evalStatus(value, idealCheck) {
    return idealCheck(value) ? "Sehat" : "Perlu ditingkatkan";
  }

  /* ----- SHEET 0 ----- */
  function SectionKonsep() {
    const reflectQ = [
      { key: "a", q: "Pemahaman tentang urgensi perencanaan keuangan dalam Islam" },
      { key: "b", q: "Pandangan pribadi tentang konsep harta (al-amwal) dalam Islam" },
      { key: "c", q: "Pandangan pribadi tentang konsep rezeki dalam Islam" },
      { key: "d", q: "Sikap terhadap utang menurut prinsip syariah" },
    ];
    return (
      <>
        <Card title="A. Refleksi Konsep Dasar (Pekan 1-2)" sub="Sub-CPMK 1 - Tuliskan pemahaman & pandanganmu secara singkat.">
          {reflectQ.map((r) => (
            <Field
              key={r.key}
              label={r.q}
              type="text"
              value={reflect[r.key]}
              onChange={(v) => setReflect((s) => ({ ...s, [r.key]: v }))}
            />
          ))}
        </Card>

        <Card
          title="B. Time Value of Money (TVM) & Economic Value of Time (EVT)"
          sub="Pekan 3 - Kalkulator sederhana berbasis estimasi imbal hasil syariah (bukan bunga/riba)."
        >
          <Field
            label="Nilai sekarang / Present Value (Rp)"
            value={tvm.pv}
            onChange={(v) => setTvm((s) => ({ ...s, pv: v }))}
          />
          <Field
            label="Estimasi imbal hasil syariah / tahun (%)"
            type="number"
            value={tvm.rate * 100}
            onChange={(v) => setTvm((s) => ({ ...s, rate: v / 100 }))}
            suffix="%"
            hint="Contoh: reksadana syariah, sukuk - bukan bunga tetap"
          />
          <Field
            label="Jangka waktu (tahun)"
            value={tvm.years}
            onChange={(v) => setTvm((s) => ({ ...s, years: v }))}
          />
          <Result label="Future Value (FV) = PV x (1+r)^n" value={fmt(fv)} big status="good" />
          <div style={{ marginTop: 14 }}>
            <NoteBox>
              Catatan EVT: dalam Islam, waktu memiliki nilai ekonomi karena setiap individu wajib
              produktif (bekerja, berinvestasi halal) - bukan karena bunga/riba, melainkan karena
              potensi hasil usaha yang berkah dan halal.
            </NoteBox>
          </div>
        </Card>
      </>
    );
  }

  /* ----- SHEET 1 ----- */
  function SectionCheckup() {
    return (
      <>
        <Card title="A. Neraca Pribadi (Personal Balance Sheet)" sub="Isi nilai aset dan liabilitas yang kamu miliki saat ini.">
          <h3 style={subH}>Aset</h3>
          <Field label="Kas & setara kas (tabungan, e-wallet)" value={assets.kas} onChange={(v) => setAssets((s) => ({ ...s, kas: v }))} />
          <Field label="Deposito syariah jangka pendek" value={assets.deposito} onChange={(v) => setAssets((s) => ({ ...s, deposito: v }))} />
          <Field label="Reksa dana syariah" value={assets.reksadana} onChange={(v) => setAssets((s) => ({ ...s, reksadana: v }))} />
          <Field label="Saham syariah / Sukuk" value={assets.saham} onChange={(v) => setAssets((s) => ({ ...s, saham: v }))} />
          <Field label="Emas / Logam mulia" value={assets.emas} onChange={(v) => setAssets((s) => ({ ...s, emas: v }))} />
          <Field label="Kendaraan" value={assets.kendaraan} onChange={(v) => setAssets((s) => ({ ...s, kendaraan: v }))} />
          <Field label="Gadget / barang berharga lainnya" value={assets.gadget} onChange={(v) => setAssets((s) => ({ ...s, gadget: v }))} />
          <Result label="TOTAL ASET" value={fmt(totalAset)} big />
        </Card>

        <Card title="B. Kewajiban / Liabilitas">
          <Field label="Utang jangka pendek (cicilan, paylater halal)" value={liabilities.pendek} onChange={(v) => setLiabilities((s) => ({ ...s, pendek: v }))} />
          <Field label="Utang jangka panjang (KPR syariah, dll)" value={liabilities.panjang} onChange={(v) => setLiabilities((s) => ({ ...s, panjang: v }))} />
          <Field label="Utang lainnya" value={liabilities.lainnya} onChange={(v) => setLiabilities((s) => ({ ...s, lainnya: v }))} />
          <Result label="TOTAL LIABILITAS" value={fmt(totalLiab)} />
          <Result label="KEKAYAAN BERSIH (NET WORTH)" value={fmt(netWorth)} big status={netWorth >= 0 ? "good" : "bad"} />
        </Card>

        <Card title="C. Rasio Keuangan Pribadi" sub="Otomatis terhitung berdasarkan Neraca Pribadi dan Sheet 2. Anggaran Bulanan.">
          <RatioRow
            label="Rasio Likuiditas (bulan)"
            value={ratioLikuiditas.toFixed(2) + "x"}
            ideal=">= 3 - 6 bulan"
            ok={ratioLikuiditas >= 3}
          />
          <RatioRow
            label="Rasio Menabung & Investasi"
            value={pct(ratioMenabung)}
            ideal=">= 10%"
            ok={ratioMenabung >= 0.1}
          />
          <RatioRow
            label="Rasio Utang terhadap Aset"
            value={pct(ratioUtangAset)}
            ideal="<= 50%"
            ok={ratioUtangAset <= 0.5}
          />
          <RatioRow
            label="Rasio Cicilan Utang"
            value={pct(ratioCicilan)}
            ideal="<= 30%"
            ok={ratioCicilan <= 0.3}
          />
        </Card>
      </>
    );
  }

  function RatioRow({ label, value, ideal, ok }) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: "1px solid #f3e6d8",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#5a4a3a" }}>{label}</div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Standar ideal: {ideal}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.textDark }}>{value}</div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: ok ? C.good : C.bad,
            }}
          >
            {ok ? "Sehat" : "Perlu ditingkatkan"}
          </div>
        </div>
      </div>
    );
  }

  /* ----- SHEET 2 ----- */
  function SectionAnggaran() {
    const cats = [
      { key: "zis", label: "Kewajiban Syariah (Zakat, Infaq, Sedekah)", goalMin: 0.025, goalMax: 0.10, goalLabel: "2,5% - 10%" },
      { key: "investasi", label: "Tabungan & Investasi", goalMin: 0.20, goalMax: 1, goalLabel: ">= 20%" },
      { key: "cicilan", label: "Cicilan / Pelunasan Utang", goalMin: 0, goalMax: 1, goalLabel: "-" },
      { key: "kebutuhan", label: "Kebutuhan Pokok (Needs)", goalMin: 0, goalMax: 0.50, goalLabel: "<= 50%" },
      { key: "keinginan", label: "Keinginan / Gaya Hidup (Wants)", goalMin: 0, goalMax: 0.20, goalLabel: "<= 20%" },
    ];
    return (
      <>
        <Card title="A. Pemasukan Bulanan">
          <Field label="Gaji / Uang saku / Pendapatan utama" value={income.gaji} onChange={(v) => setIncome((s) => ({ ...s, gaji: v }))} />
          <Field label="Pendapatan lain (usaha, freelance, dll)" value={income.lain} onChange={(v) => setIncome((s) => ({ ...s, lain: v }))} />
          <Result label="TOTAL PEMASUKAN" value={fmt(totalIncome)} big />
        </Card>

        <Card title="B. Pengeluaran Bulanan" sub="Acuan alokasi syariah ditampilkan otomatis di bawah masing-masing kategori.">
          {cats.map((c) => {
            const pVal = pctOf(spending[c.key]);
            const ok = c.key === "cicilan" ? true : pVal >= c.goalMin && pVal <= c.goalMax;
            return (
              <div key={c.key}>
                <Field
                  label={`${c.label}  (${pct(pVal)} dari pemasukan)`}
                  value={spending[c.key]}
                  onChange={(v) => setSpending((s) => ({ ...s, [c.key]: v }))}
                />
                {c.key !== "cicilan" && (
                  <Bar label="" planned={pVal} goalLabel={`target ${c.goalLabel}`} ok={ok} value={pct(pVal)} />
                )}
              </div>
            );
          })}
          <Result label="TOTAL PENGELUARAN" value={fmt(totalSpending)} big />
        </Card>

        <Card title="C. Surplus / (Defisit)">
          <Result
            label="SURPLUS / (DEFISIT) = Pemasukan - Pengeluaran"
            value={fmt(surplus)}
            big
            status={surplus >= 0 ? "good" : "bad"}
          />
          <div style={{ marginTop: 12 }}>
            <NoteBox>
              {surplus >= 0
                ? "SURPLUS - alokasikan ke investasi/dana darurat."
                : "DEFISIT - perlu strategi pemulihan (kurangi pengeluaran Wants atau cari tambahan pemasukan halal)."}
            </NoteBox>
          </div>
        </Card>
      </>
    );
  }

  /* ----- SHEET 3 ----- */
  function SectionDarurat() {
    return (
      <Card title="Perencanaan Dana Darurat" sub="Sub-CPMK 3 - Tawakkal, sabar, ikhtiar.">
        <Result label="Pengeluaran bulanan (dari Sheet 2)" value={fmt(totalSpending)} />
        <Field
          label="Faktor pengali (Lajang 3x; Menikah 6x; Berkeluarga+anak 9-12x)"
          value={darurat.faktor}
          onChange={(v) => setDarurat((s) => ({ ...s, faktor: v }))}
        />
        <Result label="TARGET DANA DARURAT" value={fmt(targetDarurat)} big />
        <Field
          label="Dana darurat yang sudah dimiliki saat ini"
          value={darurat.dimiliki}
          onChange={(v) => setDarurat((s) => ({ ...s, dimiliki: v }))}
        />
        <Result label="KEKURANGAN DANA DARURAT" value={fmt(kekuranganDarurat)} status={kekuranganDarurat > 0 ? "bad" : "good"} />
        <Field
          label="Rencana menyisihkan per bulan"
          value={darurat.sisihkan}
          onChange={(v) => setDarurat((s) => ({ ...s, sisihkan: v }))}
        />
        <Result label="Estimasi waktu pemenuhan (bulan)" value={waktuDarurat + " bulan"} big />
        <div style={{ marginTop: 12 }}>
          <NoteBox>
            Dana darurat harus likuid (mudah diambil sewaktu-waktu) dan ditempatkan pada instrumen
            aman, misalnya tabungan syariah atau deposito syariah jangka pendek.
          </NoteBox>
        </div>
      </Card>
    );
  }

  /* ----- SHEET 4 ----- */
  function SectionInvestasi() {
    const update = (i, key, val) => {
      setInvestRows((rows) => {
        const next = [...rows];
        next[i] = { ...next[i], [key]: val };
        return next;
      });
    };
    return (
      <>
        <Card title="Perencanaan Alokasi Investasi Syariah" sub="Sub-CPMK 4 - Isi rencana investasi jangka pendek & panjang.">
          {investRows.map((r, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #f3e6d8",
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                background: i % 2 === 0 ? "#fff" : C.peachLighter,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8 }}>
                Tujuan #{i + 1}
              </div>
              <Field label="Tujuan Keuangan" type="text" value={r.tujuan} onChange={(v) => update(i, "tujuan", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="Jangka Waktu"
                  options={["Pendek (< 1 th)", "Panjang (>= 1 th)"]}
                  value={r.jangka}
                  onChange={(v) => update(i, "jangka", v)}
                />
                <Field
                  label="Profil Risiko"
                  options={["Rendah", "Sedang", "Tinggi"]}
                  value={r.risiko}
                  onChange={(v) => update(i, "risiko", v)}
                />
              </div>
              <Field label="Target Dana (Rp)" value={r.target} onChange={(v) => update(i, "target", v)} />
              <Field label="Instrumen Syariah" type="text" value={r.instrumen} onChange={(v) => update(i, "instrumen", v)} hint="Contoh: Reksadana Pasar Uang Syariah, Sukuk Ritel, Saham Syariah (ISSI/JII), Emas" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Setoran/bulan (Rp)" value={r.setoran} onChange={(v) => update(i, "setoran", v)} />
                <Field label="Estimasi Return/th" type="text" value={r.returnRate} onChange={(v) => update(i, "returnRate", v)} hint="contoh: 3%-4%" />
              </div>
            </div>
          ))}
          <Result label="TOTAL SETORAN INVESTASI / BULAN" value={fmt(totalSetoranInvest)} big />
          <Result label="TOTAL TARGET DANA INVESTASI" value={fmt(totalTargetInvest)} big />
        </Card>
        <NoteBox>
          Instrumen syariah a.l. Reksa Dana Syariah, Sukuk (Ritel/Negara), Saham Syariah (ISSI/JII),
          Emas, dan Deposito Mudharabah. Pastikan bebas riba, gharar, dan maysir.
        </NoteBox>
      </>
    );
  }

  /* ----- SHEET 5 ----- */
  function SectionPensiun() {
    return (
      <Card title="Perencanaan Dana Pensiun" sub="Sub-CPMK 4 - Pekan 11.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Usia saat ini" value={pensiun.usiaSekarang} onChange={(v) => setPensiun((s) => ({ ...s, usiaSekarang: v }))} />
          <Field label="Usia rencana pensiun" value={pensiun.usiaPensiun} onChange={(v) => setPensiun((s) => ({ ...s, usiaPensiun: v }))} />
          <Field label="Usia harapan hidup" value={pensiun.usiaHidup} onChange={(v) => setPensiun((s) => ({ ...s, usiaHidup: v }))} />
        </div>
        <Result label="Masa menabung (tahun)" value={masaMenabung} />
        <Result label="Masa pensiun (tahun)" value={masaPensiun} />
        <Field
          label="Estimasi pengeluaran bulanan saat pensiun (Rp)"
          value={pensiun.pengeluaran}
          onChange={(v) => setPensiun((s) => ({ ...s, pengeluaran: v }))}
        />
        <Result label="Estimasi kebutuhan dana pensiun" value={fmt(kebutuhanPensiun)} big />
        <Field
          label="Setoran rutin per bulan yang direncanakan (Rp)"
          value={pensiun.setoran}
          onChange={(v) => setPensiun((s) => ({ ...s, setoran: v }))}
        />
        <Field
          label="Skema/produk syariah"
          type="text"
          value={pensiun.skema}
          onChange={(v) => setPensiun((s) => ({ ...s, skema: v }))}
          hint="Contoh: DPLK Syariah, emas, properti, kombinasi instrumen syariah"
        />
        {pensiun.setoran > 0 && masaMenabung > 0 && (
          <div style={{ marginTop: 12 }}>
            <NoteBox>
              Estimasi total setoran selama masa menabung:{" "}
              {fmt(pensiun.setoran * 12 * masaMenabung)}. Bandingkan dengan kebutuhan dana pensiun
              di atas untuk mengevaluasi kecukupan rencana.
            </NoteBox>
          </div>
        )}
      </Card>
    );
  }

  /* ----- SHEET 6 ----- */
  function SectionTakaful() {
    const update = (i, key, val) => {
      setTakaful((rows) => {
        const next = [...rows];
        next[i] = { ...next[i], [key]: val };
        return next;
      });
    };
    return (
      <>
        <Card title="Perencanaan Proteksi (Takaful)" sub="Sub-CPMK 5 - Pekan 12.">
          {takaful.map((r, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #f3e6d8",
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                background: i % 2 === 0 ? "#fff" : C.peachLighter,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 8 }}>
                {r.risiko}
              </div>
              <Field label="Produk Takaful" type="text" value={r.produk} onChange={(v) => update(i, "produk", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Uang Pertanggungan (Rp)" value={r.pertanggungan} onChange={(v) => update(i, "pertanggungan", v)} />
                <Field label="Kontribusi/Premi (Rp/bln)" value={r.premi} onChange={(v) => update(i, "premi", v)} />
              </div>
              <Field label="Status" options={["Sudah", "Belum"]} value={r.status} onChange={(v) => update(i, "status", v)} />
            </div>
          ))}
        </Card>
        <NoteBox>
          Takaful adalah sistem proteksi syariah berbasis tolong-menolong (ta'awun) dan berbagi
          risiko (risk sharing) - berbeda dari asuransi konvensional yang mengandung riba, gharar,
          dan maysir.
        </NoteBox>
      </>
    );
  }

  /* ----- SHEET 7 ----- */
  function SectionZiswaf() {
    return (
      <Card title="Pemurnian Harta (Islamic Wealth Purification - ZISWAF)" sub="Sub-CPMK 5 - Pekan 13.">
        <Field
          label="Total harta wajib zakat (telah haul & nishab)"
          value={ziswaf.hartaWajib}
          onChange={(v) => setZiswaf((s) => ({ ...s, hartaWajib: v }))}
        />
        <Result label="Zakat Maal (2,5%)" value={fmt(zakatMaal)} />
        <Field
          label="Zakat Penghasilan (2,5% dari penghasilan/th, opsional)"
          value={ziswaf.zakatPenghasilan}
          onChange={(v) => setZiswaf((s) => ({ ...s, zakatPenghasilan: v }))}
        />
        <Field
          label="Infaq & Sedekah rutin (per tahun)"
          value={ziswaf.infaq}
          onChange={(v) => setZiswaf((s) => ({ ...s, infaq: v }))}
        />
        <Field
          label="Wakaf (uang/aset)"
          value={ziswaf.wakaf}
          onChange={(v) => setZiswaf((s) => ({ ...s, wakaf: v }))}
        />
        <Field
          label="Pembersihan pendapatan non-halal (jika ada)"
          value={ziswaf.nonHalal}
          onChange={(v) => setZiswaf((s) => ({ ...s, nonHalal: v }))}
        />
        <Result label="TOTAL PEMURNIAN HARTA / TAHUN" value={fmt(totalPemurnian)} big status="good" />
      </Card>
    );
  }

  /* ----- SHEET 8 ----- */
  function SectionAkumulasi() {
    const update = (i, key, val) => {
      setAkumulasi((rows) => {
        const next = [...rows];
        next[i] = { ...next[i], [key]: val };
        return next;
      });
    };
    return (
      <>
        <Card title="Akumulasi Kekayaan (Emas, Properti, Bisnis)" sub="Sub-CPMK 5 - Pekan 14-15.">
          {akumulasi.map((r, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #f3e6d8",
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                background: i % 2 === 0 ? "#fff" : C.peachLighter,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 8 }}>
                {r.instrumen}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Target Nilai (Rp)" value={r.target} onChange={(v) => update(i, "target", v)} />
                <Field label="Alokasi (%)" value={r.alokasi} onChange={(v) => update(i, "alokasi", v)} suffix="%" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Estimasi Pertumbuhan/th" type="text" value={r.growth} onChange={(v) => update(i, "growth", v)} hint="contoh: 5%-8%" />
                <Field label="Tingkat Risiko" options={["Rendah", "Sedang", "Tinggi"]} value={r.risiko} onChange={(v) => update(i, "risiko", v)} />
              </div>
              <Field label="Catatan Kesesuaian Syariah" type="text" value={r.catatan} onChange={(v) => update(i, "catatan", v)} />
            </div>
          ))}
          <Result label="TOTAL TARGET NILAI" value={fmt(totalTargetAkumulasi)} />
          <Result
            label="TOTAL ALOKASI"
            value={totalAlokasiAkumulasi + "%"}
            status={totalAlokasiAkumulasi === 100 ? "good" : "bad"}
          />
          {totalAlokasiAkumulasi !== 100 && (
            <div style={{ marginTop: 8 }}>
              <NoteBox>Pastikan total Alokasi (%) berjumlah 100%.</NoteBox>
            </div>
          )}
        </Card>
      </>
    );
  }

  /* ----- SHEET 9 ----- */
  function SectionRingkasan() {
    return (
      <>
        <Card title="A. Indikator Ringkasan (Otomatis)" sub="Terhubung otomatis dengan sheet 0-8.">
          <Result label="Kekayaan Bersih / Net Worth" value={fmt(netWorth)} status={netWorth >= 0 ? "good" : "bad"} />
          <Result label="Total Pemasukan Bulanan" value={fmt(totalIncome)} />
          <Result label="Surplus / (Defisit) Bulanan" value={fmt(surplus)} status={surplus >= 0 ? "good" : "bad"} />
          <Result label="Target Dana Darurat" value={fmt(targetDarurat)} />
          <Result label="Total Setoran Investasi Syariah / Bulan" value={fmt(totalSetoranInvest)} />
          <Result label="Total Target Dana Investasi Syariah" value={fmt(totalTargetInvest)} />
          <Result label="Estimasi Kebutuhan Dana Pensiun" value={fmt(kebutuhanPensiun)} />
          <Result label="Total Pemurnian Harta / Tahun" value={fmt(totalPemurnian)} />
        </Card>

        <Card title="B. Rencana Aksi (SMART)" sub="Wajib diisi - inti dari penilaian UAS (20%).">
          {[
            { key: "pendek", dl: "pendekDeadline", label: "Jangka Pendek (< 1 tahun)" },
            { key: "menengah", dl: "menengahDeadline", label: "Jangka Menengah (1-5 tahun)" },
            { key: "panjang", dl: "panjangDeadline", label: "Jangka Panjang (> 5 tahun)" },
          ].map((h) => (
            <div key={h.key} style={{ marginBottom: 16 }}>
              <Field label={`${h.label} - Rencana / Target`} type="text" value={aksi[h.key]} onChange={(v) => setAksi((s) => ({ ...s, [h.key]: v }))} />
              <Field label="Tenggat" type="text" value={aksi[h.dl]} onChange={(v) => setAksi((s) => ({ ...s, [h.dl]: v }))} />
            </div>
          ))}
        </Card>
      </>
    );
  }

  /* ----- SHEET 10 ----- */
  function SectionDashboard() {
    const cats = [
      { key: "zis", label: "ZIS", min: 0.025, max: 0.10, goal: "2,5% - 10%" },
      { key: "investasi", label: "Tabungan & Investasi", min: 0.20, max: 1, goal: ">= 20%" },
      { key: "kebutuhan", label: "Kebutuhan", min: 0, max: 0.50, goal: "<= 50%" },
      { key: "keinginan", label: "Keinginan", min: 0, max: 0.20, goal: "<= 20%" },
    ];
    const left = totalIncome - totalSpending;
    return (
      <>
        <Banner>JUNE - BUDGET DASHBOARD (Otomatis dari Sheet 2. Anggaran Bulanan)</Banner>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="Income Summary">
            <Result label="Total Pemasukan" value={fmt(totalIncome)} />
            <Result label="Total Pengeluaran" value={fmt(totalSpending)} />
            <Result label="Sisa (Left)" value={fmt(left)} big status={left >= 0 ? "good" : "bad"} />
          </Card>

          <Card title="% Breakdown vs Goal">
            {cats.map((c) => {
              const v = pctOf(spending[c.key]);
              const ok = v >= c.min && v <= c.max;
              return <Bar key={c.key} label={c.label} planned={v} goalLabel={`target ${c.goal}`} ok={ok} value={pct(v)} />;
            })}
          </Card>
        </div>

        <Card title="Cash Flow per Kategori">
          {cats.map((c) => (
            <Result key={c.key} label={c.label} value={fmt(spending[c.key])} />
          ))}
          <Result label="LEFT" value={fmt(left)} big status={left >= 0 ? "good" : "bad"} />
        </Card>

        <NoteBox>
          Catatan target alokasi syariah (acuan): ZIS 2,5%-10% | Tabungan & Investasi {">"}= 20% |
          Kebutuhan {"<"}= 50% | Keinginan {"<"}= 20%.
        </NoteBox>
      </>
    );
  }

  /* ============================================================
     LAYOUT
  ============================================================ */
  const SECTIONS = {
    konsep: SectionKonsep,
    checkup: SectionCheckup,
    anggaran: SectionAnggaran,
    darurat: SectionDarurat,
    investasi: SectionInvestasi,
    pensiun: SectionPensiun,
    takaful: SectionTakaful,
    ziswaf: SectionZiswaf,
    akumulasi: SectionAkumulasi,
    ringkasan: SectionRingkasan,
    dashboard: SectionDashboard,
  };
  const ActiveSection = SECTIONS[active];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily:
          "'Segoe UI', system-ui, -apple-system, sans-serif",
        background: "#FAF6F1",
        color: "#3a2e22",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 260,
          background: "#fff",
          borderRight: "1px solid #f0e0cf",
          padding: "24px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, letterSpacing: 1 }}>
            BOOKPLAN
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.textDark, lineHeight: 1.3 }}>
            Perencanaan Keuangan Syariah
          </div>
        </div>
        {MENU.map((m) => (
          <div
            key={m.id}
            onClick={() => setActive(m.id)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: active === m.id ? 700 : 500,
              color: active === m.id ? C.accent : "#6a5a4a",
              background: active === m.id ? C.peachLighter : "transparent",
              borderLeft: active === m.id ? `3px solid ${C.accent}` : "3px solid transparent",
              transition: "all .15s",
            }}
          >
            {m.label}
          </div>
        ))}
        <div style={{ padding: "20px 20px 0" }}>
          <NoteBox>
            Catatan: Data pada aplikasi ini bersifat sementara (tidak tersimpan permanen). Untuk
            menyimpan progres, gunakan versi Excel Bookplan.
          </NoteBox>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "32px 40px", maxWidth: 920 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: C.textDark,
            marginTop: 0,
            marginBottom: 4,
          }}
        >
          {MENU.find((m) => m.id === active)?.label}
        </h1>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
          Mata Kuliah Perencanaan Keuangan Syariah (EKS124507) - Bookplan Interaktif
        </p>
        <ActiveSection />
      </div>
    </div>
  );
}

const subH = {
  fontSize: 13,
  fontWeight: 700,
  color: C.accent,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginTop: 0,
  marginBottom: 8,
};
