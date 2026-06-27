--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-1.pgdg110+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin_inpeta
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin_inpeta;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin_inpeta
--

COMMENT ON SCHEMA public IS '';


--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: admin_inpeta
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO admin_inpeta;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: admin_inpeta
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO admin_inpeta;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: admin_inpeta
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO admin_inpeta;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: admin_inpeta
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.api_keys (
    id text NOT NULL,
    key character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.api_keys OWNER TO admin_inpeta;

--
-- Name: berita; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.berita (
    id integer NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    image_url text NOT NULL,
    source_url text NOT NULL,
    published_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.berita OWNER TO admin_inpeta;

--
-- Name: berita_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.berita_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.berita_id_seq OWNER TO admin_inpeta;

--
-- Name: berita_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.berita_id_seq OWNED BY public.berita.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.faqs OWNER TO admin_inpeta;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.faqs_id_seq OWNER TO admin_inpeta;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: fasilitas; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.fasilitas (
    id text NOT NULL,
    wilayah_id integer NOT NULL,
    nama_lokasi text NOT NULL,
    kategori text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    alamat text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.fasilitas OWNER TO admin_inpeta;

--
-- Name: fitur_unggulan; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.fitur_unggulan (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon_url text NOT NULL,
    url text
);


ALTER TABLE public.fitur_unggulan OWNER TO admin_inpeta;

--
-- Name: fitur_unggulan_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.fitur_unggulan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fitur_unggulan_id_seq OWNER TO admin_inpeta;

--
-- Name: fitur_unggulan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.fitur_unggulan_id_seq OWNED BY public.fitur_unggulan.id;


--
-- Name: footer_configs; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.footer_configs (
    id integer NOT NULL,
    logo_url text NOT NULL,
    description text NOT NULL,
    alamat text NOT NULL,
    email text NOT NULL,
    telepon text NOT NULL,
    copyright text NOT NULL,
    facebook_url text,
    instagram_url text,
    twitter_url text,
    youtube_url text,
    is_active boolean DEFAULT false NOT NULL
);


ALTER TABLE public.footer_configs OWNER TO admin_inpeta;

--
-- Name: footer_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.footer_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.footer_configs_id_seq OWNER TO admin_inpeta;

--
-- Name: footer_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.footer_configs_id_seq OWNED BY public.footer_configs.id;


--
-- Name: hero_contents; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.hero_contents (
    id integer NOT NULL,
    main_title character varying(255) NOT NULL,
    description text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.hero_contents OWNER TO admin_inpeta;

--
-- Name: hero_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.hero_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hero_contents_id_seq OWNER TO admin_inpeta;

--
-- Name: hero_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.hero_contents_id_seq OWNED BY public.hero_contents.id;


--
-- Name: hero_stats; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.hero_stats (
    id integer NOT NULL,
    stat_value character varying(50) NOT NULL,
    stat_label character varying(100) NOT NULL,
    order_index integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.hero_stats OWNER TO admin_inpeta;

--
-- Name: hero_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.hero_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hero_stats_id_seq OWNER TO admin_inpeta;

--
-- Name: hero_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.hero_stats_id_seq OWNED BY public.hero_stats.id;


--
-- Name: logo; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.logo (
    id integer NOT NULL,
    image_url character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.logo OWNER TO admin_inpeta;

--
-- Name: logo_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.logo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logo_id_seq OWNER TO admin_inpeta;

--
-- Name: logo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.logo_id_seq OWNED BY public.logo.id;


--
-- Name: navbar_menus; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.navbar_menus (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    url character varying(255) NOT NULL,
    parent_id integer,
    order_index integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.navbar_menus OWNER TO admin_inpeta;

--
-- Name: navbar_menus_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.navbar_menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.navbar_menus_id_seq OWNER TO admin_inpeta;

--
-- Name: navbar_menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.navbar_menus_id_seq OWNED BY public.navbar_menus.id;


--
-- Name: pengaturan_web; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.pengaturan_web (
    id integer DEFAULT 1 NOT NULL,
    nama_instansi text NOT NULL,
    alamat_lengkap text NOT NULL,
    email_kontak text NOT NULL,
    no_telepon text NOT NULL,
    stat_populasi text NOT NULL,
    stat_wilayah text NOT NULL,
    stat_fasilitas text NOT NULL
);


ALTER TABLE public.pengaturan_web OWNER TO admin_inpeta;

--
-- Name: populasi; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.populasi (
    id text NOT NULL,
    wilayah_id integer NOT NULL,
    tahun integer NOT NULL,
    jml_sapi integer DEFAULT 0 NOT NULL,
    jml_kambing integer DEFAULT 0 NOT NULL,
    jml_ayam integer DEFAULT 0 NOT NULL,
    jml_kerbau integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.populasi OWNER TO admin_inpeta;

--
-- Name: tentang_contents; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.tentang_contents (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image_url text,
    is_active boolean DEFAULT false NOT NULL
);


ALTER TABLE public.tentang_contents OWNER TO admin_inpeta;

--
-- Name: tentang_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.tentang_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tentang_contents_id_seq OWNER TO admin_inpeta;

--
-- Name: tentang_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.tentang_contents_id_seq OWNED BY public.tentang_contents.id;


--
-- Name: tentang_points; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.tentang_points (
    id integer NOT NULL,
    text text NOT NULL,
    url text
);


ALTER TABLE public.tentang_points OWNER TO admin_inpeta;

--
-- Name: tentang_points_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.tentang_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tentang_points_id_seq OWNER TO admin_inpeta;

--
-- Name: tentang_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.tentang_points_id_seq OWNED BY public.tentang_points.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    nama_lengkap text NOT NULL,
    role text DEFAULT 'ADMIN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dark_mode boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO admin_inpeta;

--
-- Name: wilayah; Type: TABLE; Schema: public; Owner: admin_inpeta
--

CREATE TABLE public.wilayah (
    id integer NOT NULL,
    nama_wilayah text NOT NULL,
    level text NOT NULL,
    parent_id integer,
    geojson_polygon jsonb,
    warna_area text
);


ALTER TABLE public.wilayah OWNER TO admin_inpeta;

--
-- Name: wilayah_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_inpeta
--

CREATE SEQUENCE public.wilayah_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wilayah_id_seq OWNER TO admin_inpeta;

--
-- Name: wilayah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_inpeta
--

ALTER SEQUENCE public.wilayah_id_seq OWNED BY public.wilayah.id;


--
-- Name: berita id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.berita ALTER COLUMN id SET DEFAULT nextval('public.berita_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: fitur_unggulan id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.fitur_unggulan ALTER COLUMN id SET DEFAULT nextval('public.fitur_unggulan_id_seq'::regclass);


--
-- Name: footer_configs id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.footer_configs ALTER COLUMN id SET DEFAULT nextval('public.footer_configs_id_seq'::regclass);


--
-- Name: hero_contents id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.hero_contents ALTER COLUMN id SET DEFAULT nextval('public.hero_contents_id_seq'::regclass);


--
-- Name: hero_stats id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.hero_stats ALTER COLUMN id SET DEFAULT nextval('public.hero_stats_id_seq'::regclass);


--
-- Name: logo id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.logo ALTER COLUMN id SET DEFAULT nextval('public.logo_id_seq'::regclass);


--
-- Name: navbar_menus id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.navbar_menus ALTER COLUMN id SET DEFAULT nextval('public.navbar_menus_id_seq'::regclass);


--
-- Name: tentang_contents id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.tentang_contents ALTER COLUMN id SET DEFAULT nextval('public.tentang_contents_id_seq'::regclass);


--
-- Name: tentang_points id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.tentang_points ALTER COLUMN id SET DEFAULT nextval('public.tentang_points_id_seq'::regclass);


--
-- Name: wilayah id; Type: DEFAULT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.wilayah ALTER COLUMN id SET DEFAULT nextval('public.wilayah_id_seq'::regclass);


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.api_keys (id, key, description, "isActive", "createdAt") FROM stdin;
66c3da20-125a-4842-a3d8-dca0e450a9bb	inpeta_ac1f1aab7716e217cc9fa2c7cf215e9142cffa8521f3c9b3cb398155ecb06b41	Aplikasi Mobile Inpeta	t	2026-05-12 03:24:36.872
\.


--
-- Data for Name: berita; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.berita (id, title, summary, image_url, source_url, published_at, is_active) FROM stdin;
11	Gubernur Aceh Lakukan Diplomasi Pangan, Percepat Impor Ternak Jelang Ramadhan	Menyambut bulan suci Ramadhan 2026, Gubernur Aceh Muzakir Manaf mengambil langkah cepat dan strategis melalui diplomasi pangan dengan pemerintah pusat guna mempercepat proses impor ternak. Langkah ini dilakukan untuk memastikan ketersediaan stok daging serta menjaga stabilitas harga di Aceh, khususnya menjelang tradisi Meugang dan selama bulan puasa.	http://127.0.0.1:5000/uploads/logo-1778472470792.jpeg	https://acehprov.go.id/berita/kategori/pangan/gubernur-aceh-lakukan-diplomasi-pangan-percepat-impor-ternak-jelang-ramadhan	2026-05-11 04:07:50.803	t
12	Aceh persiapkan 24 Ekor Kurban Presiden Berbobot Hingga 1 Ton	Pemerintah Aceh melalui Dinas Peternakan Aceh memastikan kesiapan pelaksanaan program bantuan kemasyarakatan (Banmas) berupa sapi kurban Presiden untuk menyambut Idul Adha 1447 Hijriah. Sebanyak 24 ekor sapi disiapkan untuk didistribusikan ke seluruh kabupaten/kota, dengan target bobot minimal mencapai 1 ton per ekor.	http://127.0.0.1:5000/uploads/logo-1778473295552.jpeg	https://putaran.id/aceh-persiapkan-24-ekor-kurban-presiden-berbobot-hingga-1-ton/	2026-05-11 04:21:35.556	t
13	Distan Aceh Besar Vaksinasi dan Beri Vitamin pada 100 Ternak di Kuta Baro dan Ingin Jaya	KOTA JANTHO – Pemerintah Kabupaten (Pemkab) Aceh Besar melalui Dinas Pertanian (Distan) khususnya Bidang Peternakan dan Kesehatan Hewan, melakukan vaksinasi, pemberian vitamin, serta obat-obatan terhadap 100 ternak milik masyarakat di wilayah kerja Puskeswan Kuta Baro dan Kecamatan Ingin Jaya, Kabupaten Aceh Besar, Rabu (8/4/2026).\r\n\r\nSebanyak 100 ekor ternak tersebut, yakni 50 ekor ternak di wilayah Kuta Baro dan 50 ekor lainnya di Kecamatan Ingin Jaya. Program tersebut merupakan bagian dari upaya pemerintah daerah dalam menjaga kesehatan hewan ternak serta meningkatkan produktivitas peternakan masyarakat.	http://127.0.0.1:5000/uploads/logo-1778473691931.jpeg	https://acehbesarkab.go.id/berita/kategori/peternakan/distan-aceh-besar-vaksinasi-dan-beri-vitamin-pada-100-ternak-di-kuta-baro-dan-ingin-jaya	2026-05-11 04:28:11.935	t
14	Bupati Aceh Besar Tinjau UPTD Peternakan Ayam Petelur	KOTA JANTHO – Bupati Aceh Besar, H Muharram Idris yang akrab disapa Syech Muharram, meninjau Unit Pelaksana Teknis Daerah (UPTD) Peternakan Ayam Petelur milik Pemerintah Aceh yang berada di Gampong Data Makmur, Kecamatan Blang Bintang, Kabupaten Aceh Besar, Rabu (25/6/2025) sore.\r\n\r\nDalam kunjungan tersebut, Bupati Syech Muharram turut didampingi Kepala Dinas Pertanian Aceh Besar Jakfar, SP MS, Kepala Dinas PUPR Aceh Besar Ir Syahrial Amanullah, ST, serta Kabid Peternakan Aceh Besar, Uzir, SPT MSi. Kunjungan tersebut bertujuan untuk melihat langsung potensi serta kondisi aktual peternakan tersebut yang selama ini belum beroperasi secara optimal.\r\n\r\n	http://127.0.0.1:5000/uploads/logo-1778473745497.jpg	https://acehbesarkab.go.id/berita/kategori/peternakan/bupati-aceh-besar-tinjau-uptd-peternakan-ayam-petelur	2026-05-11 04:29:05.498	t
15	Pemkab Aceh Besar dan Lanud SIM Gelar Kontes Ternak	Kepala Dinas Pertanian Aceh Besar, Jakfar SP MSi melalui Kepala Bidang Peternakan, Uzir SPt MSi, menyampaikan bahwa kegiatan ini merupakan bentuk sinergi antara Pemkab Aceh Besar dan Lanud SIM dalam memperingati momen penting bagi TNI AU, sekaligus menjadi ajang peningkatan kualitas serta promosi sektor peternakan di Aceh Besar.	http://127.0.0.1:5000/uploads/logo-1778473798446.jpg	https://acehbesarkab.go.id/berita/kategori/peternakan/pemkab-aceh-besar-dan-lanud-sim-gelar-kontes-ternak	2026-05-11 04:29:58.448	t
16	Kadistan Aceh Besar: Peternak Manfaatkan Bantaran Krueng Aceh Untuk Penggemukan Sapi	Kepala Dinas Pertanian (Kadistan) Kabupaten Aceh Besar Jakfar SP MSi mengatakan masyarakat, khususnya para peternak tetap bisa memanfaatkan kawasan bantaran sungai itu sepanjang tidak merusak fungsi sungai. “Peternak tetap bisa memanfaatkan kawasan itu sepanjang tidak merusak fungsi sungai. Hanya saja, harus tetap mengikuti prosedur dan mekanisme pemanfaatkan lahan milik pemerintah dibawah Balai Wilayah Sungai Sumatera 1 itu, seperti misalnya lokasi kandang sapi hanya saja dibatasi 5 meter dari batas pinggir Sungai,” kata Jakfar di Kota Jantho, Kamis (10/04/2025).	http://127.0.0.1:5000/uploads/logo-1778473841962.jpg	https://acehbesarkab.go.id/berita/kategori/peternakan/kadistan-aceh-besar-peternak-manfaatkan-bantaran-krueng-aceh-untuk-penggemukan-sapi	2026-05-11 04:30:41.963	t
17	Bupati Aceh Besar Buka Sosialisasi Program Peternakan Terpadu BUMGAMA	Turut hadir Kepala Dinas Pemberdayaan Masyarakat dan Gampong (DPMG) Aceh Besar Carbaini S.Ag, Camat Sukamakmur Azhari SH MSi, unsur Forkipimcam Sukamakmur serta Ketua Apdesi Kecamatan Sukamakmur Jailani.	http://127.0.0.1:5000/uploads/logo-1778473885261.jpg	https://acehbesarkab.go.id/berita/kategori/peternakan/bupati-aceh-besar-buka-sosialisasi-program-peternakan-terpadu-bumgama	2026-05-11 04:31:25.263	t
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.faqs (id, question, answer, is_active) FROM stdin;
5	Apa itu InPETA - Informasi Peternakan Terintegrasi Aceh?	Merupakan Sistem Pemetaan Interaktif Basis Data Center Dinas Peternakan Aceh yang membantu Dinas Peternakan Aceh dalam pemetaan dan pengelolaan data peternakan di Aceh. Sistem ini menggunakan peta interaktif untuk mengakses informasi tentang lokasi peternakan, jenis hewan ternak, dan data pemilik dengan tujuan meningkatkan efisiensi pengelolaan data dan mendukung pengembangan sektor peternakan di Aceh.	t
6	Bagaimana mengakses Peta Data pada aplikasi InPETA - Informasi Peternakan Terintegrasi Aceh?	Peta interaktif dapat diakses pada menu PETA DATA atau klik disini	t
7	Darimana sumber data aplikasi InPETA - Informasi Peternakan Terintegrasi Aceh?	Sumber data dari relawan dan petugas lapangan merupakan elemen penting dalam pengumpulan informasi yang akurat dan real-time. Relawan adalah individu yang secara sukarela terlibat dalam mengumpulkan data, sedangkan petugas lapangan adalah individu yang secara profesional ditugaskan untuk mengumpulkan data di lokasi tertentu. Keduanya berperan sebagai mata dan telinga di lapangan, memberikan wawasan yang berharga tentang berbagai peristiwa dan fenomena yang terjadi.	t
8	Landasan peraturan APLIKASI InPETA - Informasi Peternakan Terintegrasi Aceh?	Undang-undang (UU) NO. 14, LN.2008/NO.61, TLN NO.4846, LL SETNEG : 35 HLM\nUndang-undang (UU) TENTANG Keterbukaan Informasi Publik\nBahwa informasi merupakan kebutuhan pokok setiap orang bagi pengembangan pribadi dan lingkungan sosialnya serta merupakan bagian penting bagi ketahanan nasional; bahwa hak memperoleh informasi merupakan hak asasi manusia dan keterbukaan informasi publik merupakan salah satu ciri penting negara demokratis yang menjunjung tinggi kedaulatan rakyat untuk mewujudkan penyelenggaraan negara yang baik; bahwa keterbukaan informasi publik merupakan sarana dalam mengoptimalkan pengawasan publik terhadap penyelenggaraan negara dan Badan Publik lainnya dan segala sesuatu yang berakibat pada kepentingan publik; bahwa pengelolaan Informasi Publik merupakan salah satu upaya untuk mengembangkan masyarakat informasi.	t
\.


--
-- Data for Name: fasilitas; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.fasilitas (id, wilayah_id, nama_lokasi, kategori, latitude, longitude, alamat, created_at) FROM stdin;
c6d6f40d-3b74-45ae-8efa-3222529fd61f	25	Puskeswan Ulee Kareng	PUSKESWAN	5.5414	95.3432	Jl. Teuku Ie Lubeue, Kec. Ulee Kareng	2026-05-08 02:23:30.454
0109d598-361a-45c6-9312-0858beba6209	25	Puskeswan Keudah	PUSKESWAN	5.5598	95.3181	Gampong Keudah, Kec. Kuta Raja	2026-05-08 02:23:30.484
daa2c3ec-efc0-4e87-a534-fef928cfd78b	9	Puskeswan Saree	PUSKESWAN	5.4452	95.7175	Jl. Banda Aceh-Medan, Saree, Lembah Seulawah	2026-05-08 02:23:30.502
f3c4bbd8-1d08-44b2-87eb-ddd0da050f30	9	Puskeswan Jantho	PUSKESWAN	5.2981	95.6124	Kota Jantho, Kec. Jantho	2026-05-08 02:23:30.504
d33fccc8-0d99-4776-80d9-12ab69a8d980	9	Puskeswan Lhoknga	PUSKESWAN	5.4795	95.2412	Kec. Lhoknga	2026-05-08 02:23:30.506
979a03a6-ae78-4a0d-bf88-3e2e13d1db11	19	Puskeswan Samalanga	PUSKESWAN	5.2125	96.3542	Jl. Banta Ahmad, Geulanggang Baro, Kota Juang	2026-05-08 02:23:30.509
0eccf36c-85fb-4627-b492-d69753c5b1ce	19	Puskeswan Juli	PUSKESWAN	5.1524	96.7122	Kec. Juli	2026-05-08 02:23:30.51
6439db77-a7fb-4347-b89b-50ff72758972	19	Puskeswan Gandapura	PUSKESWAN	5.2341	96.9125	Kec. Gandapura	2026-05-08 02:23:30.512
93aaecc2-f82f-4613-8066-727abc46b942	16	Puskeswan Idi Rayeuk	PUSKESWAN	4.9082	97.5124	Kec. Idi Rayeuk	2026-05-08 02:23:30.514
dbe14c62-73f1-4e96-b7e8-d8c5930c2832	23	Puskeswan Meureudu	PUSKESWAN	5.2452	96.2241	Kec. Meureudu	2026-05-08 02:23:30.516
2cb977d4-16ca-450e-a2cf-0f989b3571b5	23	Puskeswan Bandar Baru	PUSKESWAN	5.2921	96.0245	Paru Cot, Bandar Baru	2026-05-08 02:23:30.518
0b7c1bc7-5fc2-4867-9b4a-3f39ead48090	22	Puskeswan Mutiara	PUSKESWAN	5.3124	95.9452	Baro Yaman, Kec. Mutiara	2026-05-08 02:23:30.522
ee822744-5377-46ee-a089-bdda6f054557	22	Lab Veteriner Sigli	PUSKESWAN	5.3821	95.9542	Jl. Prof. A. Majid Ibrahim, Sigli	2026-05-08 02:23:30.525
254e3df7-931d-48c7-8743-576ff3ee62a9	27	Puskeswan Muara Satu	PUSKESWAN	5.2124	97.0542	Batu Phat Timur, Muara Satu	2026-05-08 02:23:30.526
0278de36-425b-4093-a5fa-c4e061c5f64b	27	Puskeswan Blang Mangat	PUSKESWAN	5.1425	97.1821	Mesjid Punteut, Blang Mangat	2026-05-08 02:23:30.527
90e595ab-14ef-4fd8-8fc8-b49eaefae6f0	17	Puskeswan Lhoksukon	PUSKESWAN	5.0421	97.3241	Kec. Lhoksukon	2026-05-08 02:23:30.528
0097f117-840e-431c-ad42-76c85fee7e1c	17	Puskeswan Dewantara	PUSKESWAN	5.2214	97.0125	Paloh Lada, Dewantara	2026-05-08 02:23:30.529
e3f1b545-7950-4356-b912-94273788933a	11	Puskeswan Meukek	PUSKESWAN	3.4241	97.0821	Tanjung Harapan, Meukek	2026-05-08 02:23:30.53
74e18fa5-4bde-40a6-8edd-559069a0bbe8	8	Puskeswan Blang Pidie	PUSKESWAN	3.7421	96.8452	Lhung Asan, Blang Pidie	2026-05-08 02:23:30.531
211af5bf-e746-465c-9def-5943e3b91838	7	Puskeswan Meureubo	PUSKESWAN	4.1245	96.1821	Paya Peunaga, Meureubo	2026-05-08 02:23:30.532
5fc4f74e-656d-4797-8f02-356fd7cac19d	21	Puskeswan Darul Makmur	PUSKESWAN	3.8842	96.5241	Alue Bilie, Darul Makmur	2026-05-08 02:23:30.533
0fe4a803-e144-4e37-b0fd-6fb6cf053407	18	Puskeswan Lampahan	PUSKESWAN	4.7421	96.7821	Kec. Timang Gajah	2026-05-08 02:23:30.534
ceb74ca5-d49b-410a-97d0-54400bd4d06f	18	Puskeswan Pondok Baru	PUSKESWAN	4.8124	96.9124	Musara, Kec. Bandar	2026-05-08 02:23:30.535
b3c531b7-9d88-4f0b-a782-be685e217933	28	Puskeswan Kota Sabang	PUSKESWAN	5.8321	95.3412	Kec. Suka Jaya	2026-05-08 02:23:30.536
d3ec808f-551a-4ee3-8a92-a4b5dbcb04c0	25	Our's Petshop & Clinic	KLINIK_HEWAN	5.5432	95.3115	Jl. Seulawah No.72, Seutui, Baiturrahman	2026-05-08 02:23:30.496
0a5f5f2b-afd8-4641-89d8-cadd4c15acd4	25	Atjeh Petshop & Clinic	KLINIK_HEWAN	5.5324	95.3089	Lam Lagang, Kec. Banda Raya	2026-05-08 02:23:30.5
ccd71431-b0a7-4f3a-8391-9ab83fc161c1	25	Al Petshop & Clinic	KLINIK_HEWAN	5.5621	95.3354	Beurawe, Kec. Kuta Alam	2026-05-08 02:23:30.498
cc35bd68-3aef-4cc6-ab66-6e9816d0e451	25	Klinik Hewan Dinas Peternakan Aceh	KLINIK_HEWAN	5.5255	95.3262	Jl. Mr. Muhammad Hasan No.147, Lhong Raya	2026-05-08 02:23:30.492
4fa57f60-588b-4b8e-98ac-8d34a04605a2	25	Royal Petcare Petshop & Clinic	KLINIK_HEWAN	5.5762	95.3524	Jl. Teuku Nyak Arief, Lamgugob, Syiah Kuala	2026-05-08 02:23:30.494
d85facc9-3d9b-4972-99e5-e17cb6e18584	9	pukeswan bekreunt	PUSKESWAN	5.606333	95.627918	j	2026-06-16 10:18:34.67
\.


--
-- Data for Name: fitur_unggulan; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.fitur_unggulan (id, title, description, icon_url, url) FROM stdin;
8	Data Statistik	Aplikasi InPETA memungkinkan masyarakat memperoleh data paling terbaru berdasarkan pendataan dari petugas lapangan secara realtime	http://127.0.0.1:5000/uploads/fitur-1777706114563.jpg	\N
9	Peta Interaktif	Aplikasi InPETA memungkinkan masyarakat memperoleh data berdasarkan wilayah	http://127.0.0.1:5000/uploads/fitur-1777706144730.svg	\N
10	Info Harga Ternak	Aplikasi InPETA memungkinkan masyarakat memperoleh harga ternak untuk tiap wilayah	http://127.0.0.1:5000/uploads/fitur-1777706160147.jpg	\N
11	Marketplace Peternakan Aceh	Platform Online yang menghubungkan pembeli dan penjual hewan peternakan di Aceh.	http://127.0.0.1:5000/uploads/fitur-1777706178314.png	\N
\.


--
-- Data for Name: footer_configs; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.footer_configs (id, logo_url, description, alamat, email, telepon, copyright, facebook_url, instagram_url, twitter_url, youtube_url, is_active) FROM stdin;
3	http://127.0.0.1:5000/uploads/logo-1777706526915.jpg	Untuk layanan pengaduan atau kebutuhan informasi lebih lanjut silahkan hubungi kami pada alamat dan kontak tersedia di bawah ini	Lamcot, Kec. Darul Imarah, Kabupaten Aceh Besar, Aceh 23122	disnak@acehprov.go.id	(0651) 7559050 – 7559090	Dinas Peternakan Aceh 2026	https://www.facebook.com/share/1Dg8Ewha7N/	https://www.instagram.com/gik_prasetya?igsh=MXg2NHkzYzBxaTZjYg==	https://x.com/axolort9999	https://youtube.com/@yogianimasi?si=l_Q1EGNMWc5PfnpG	f
4	http://127.0.0.1:5000/uploads/logo-1778474112179.png	Dinas Peternakan Aceh 2026	Lamcot, Kec. Darul Imarah, Kabupaten Aceh Besar, Aceh 23122	disnak@acehprov.go.id	 Call Center  (0651) 7559050 – 7559090	Dinas Peternakan Aceh@2026	https://www.facebook.com/share/1Dg8Ewha7N/	https://www.instagram.com/gik_prasetya?igsh=MXg2NHkzYzBxaTZjYg==	https://x.com/axolort9999	https://youtube.com/@yogianimasi?si=l_Q1EGNMWc5PfnpG	t
\.


--
-- Data for Name: hero_contents; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.hero_contents (id, main_title, description, is_active, updated_at) FROM stdin;
1	InPETA Informasi Peternakan Terintegrasi Aceh	Sebuah Aplikasi Terintegrasi Berbasis Data Terpusat yang memiliki peran kunci dalam pemetaan dan pengelolaan informasi terkait peternakan di wilayah Aceh. 	f	2026-05-20 18:42:03.982
11	Modernisasi Informasi Peternakan Aceh	Platform digital terintegrasi untuk mengakses data statistik, peta sebaran, dan informasi fasilitas peternakan di seluruh Provinsi Aceh.	t	2026-05-20 18:42:04.006
\.


--
-- Data for Name: hero_stats; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.hero_stats (id, stat_value, stat_label, order_index) FROM stdin;
1	5 JT 	Total Ternak	0
13	23	Total Kabupaten	0
14	103	Total Kecamatan	0
\.


--
-- Data for Name: logo; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.logo (id, image_url, name, is_active, uploaded_at) FROM stdin;
2	http://127.0.0.1:5000/uploads/logo-1777515674063.png	logo-inpeta - Diedit.png	t	2026-04-30 02:21:14.138
\.


--
-- Data for Name: navbar_menus; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.navbar_menus (id, title, url, parent_id, order_index) FROM stdin;
6	Berita 	/berita	\N	0
9	Bantuan	/bantuan	\N	0
12	Peta Data	/peta	\N	0
8	Tentang	#tentang	\N	0
10	FAQ	#faq	\N	0
11	Hubungi Kami	#kontak	\N	0
\.


--
-- Data for Name: pengaturan_web; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.pengaturan_web (id, nama_instansi, alamat_lengkap, email_kontak, no_telepon, stat_populasi, stat_wilayah, stat_fasilitas) FROM stdin;
\.


--
-- Data for Name: populasi; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.populasi (id, wilayah_id, tahun, jml_sapi, jml_kambing, jml_ayam, jml_kerbau) FROM stdin;
\.


--
-- Data for Name: tentang_contents; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.tentang_contents (id, title, description, image_url, is_active) FROM stdin;
1	Pusat Komando Data Peternakan	InPETA adalah portal digital terintegrasi yang menyajikan akses data statistik, peta sebaran spasial, serta direktori fasilitas kesehatan hewan langsung ke genggaman Anda.	\N	f
6	InPETA (Informasi Peternakan Terintegrasi Aceh)	Merupakan aplikasi yang dibangun oleh Dinas Peternakan Aceh untuk membantu pemetaan dan pengelolaan data terkait kegiatan peternakan di wilayah Aceh.\n\nMelalui sistem ini, pengguna dapat dengan mudah mengakses data terkait pusat data peternakan, seperti informasi mengenai lokasi peternakan, jenis hewan ternak yang dipelihara, data pemilik, dan informasi lainnya. Peta interaktif memungkinkan pengguna untuk memilih area tertentu di Aceh dan melihat data peternakan yang ada di area tersebut.\n\nSistem ini membantu Dinas Peternakan Aceh dalam mengelola data peternakan secara efisien dan memberikan informasi yang akurat kepada para pemangku kepentingan. Selain itu, dengan adanya pemetaan interaktif, sistem ini juga dapat membantu dalam perencanaan kegiatan peternakan, pemantauan, dan pengambilan keputusan yang lebih baik untuk pengembangan sektor peternakan di wilayah Aceh.	\N	t
\.


--
-- Data for Name: tentang_points; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.tentang_points (id, text, url) FROM stdin;
1	Akses data peternakan real-time dari 23 kabupaten/kota	\N
2	Web-GIS interaktif untuk visualisasi sebaran ternak	/peta
7	Berita Seputaran Ternak di Provinsi Aceh	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.users (id, email, password, nama_lengkap, role, "createdAt", avatar_url, is_active, "updatedAt", dark_mode) FROM stdin;
da3b9029-80bc-4200-b772-587605b7ee48	admin@gmail.com	$2b$10$bE.nlJaS2zB0YZcIQLHGYOuBv17C.R38JHDrheTBrL2bfy8iDZMB.	Yogi Admin MGB	STAFF	2026-05-07 12:25:24.604	http://127.0.0.1:5000/uploads/logo-1778156756638.jpg	t	2026-05-11 14:03:42.524	f
a9f379f9-dcde-480d-89a2-0d4a591b79ff	Axolotl@gmail.com	$2b$10$0fjOIgDOqNolco95hzQ6mO.EVLDH9M8QdfeMAaDC8Nl1S99CVKKN2	Axolotl	ADMIN	2026-05-07 03:50:09.767	http://127.0.0.1:5000/uploads/logo-1778125890763.jpg	t	2026-06-08 02:59:02.24	f
\.


--
-- Data for Name: wilayah; Type: TABLE DATA; Schema: public; Owner: admin_inpeta
--

COPY public.wilayah (id, nama_wilayah, level, parent_id, geojson_polygon, warna_area) FROM stdin;
7	Aceh Barat	KABUPATEN	\N	\N	#10b981
8	Aceh Barat Daya	KABUPATEN	\N	\N	#10b981
9	Aceh Besar	KABUPATEN	\N	\N	#3b82f6
10	Aceh Jaya	KABUPATEN	\N	\N	#3b82f6
11	Aceh Selatan	KABUPATEN	\N	\N	#f59e0b
12	Aceh Singkil	KABUPATEN	\N	\N	#f59e0b
13	Aceh Tamiang	KABUPATEN	\N	\N	#f59e0b
14	Aceh Tengah	KABUPATEN	\N	\N	#ef4444
15	Aceh Tenggara	KABUPATEN	\N	\N	#ef4444
16	Aceh Timur	KABUPATEN	\N	\N	#aec5f4
17	Aceh Utara	KABUPATEN	\N	\N	#3a82cf
18	Bener Meriah	KABUPATEN	\N	\N	#8b5cf6
19	Bireuen	KABUPATEN	\N	\N	#ec4899
20	Gayo Lues	KABUPATEN	\N	\N	#06b6d4
21	Nagan Raya	KABUPATEN	\N	\N	#84cc16
22	Pidie	KABUPATEN	\N	\N	#f97316
24	\tSimeulue	KABUPATEN	\N	\N	#dcee81
25	Banda Aceh	KABUPATEN	\N	\N	#d67d57
26	Langsa	KABUPATEN	\N	\N	#b946c8
27	Lhokseumawe	KABUPATEN	\N	\N	#6166ae
28	Sabang	KABUPATEN	\N	\N	#939a97
29	Subulussalam	KABUPATEN	\N	\N	#69b847
30	Muara Tiga	KECAMATAN	\N	\N	#65F67B
23	Pidie Jaya	KABUPATEN	\N	\N	#7faad2
31	Delima	KECAMATAN	\N	\N	#84B3E1
32	Geulumpang Baro	KECAMATAN	\N	\N	#2AF437
33	Geulumpang Tiga	KECAMATAN	\N	\N	#7A32D2
34	Geumpang	KECAMATAN	\N	\N	#B8F631
35	Grong-grong	KECAMATAN	\N	\N	#2B01FE
36	Indra Jaya (Pidie)	KECAMATAN	\N	\N	#F3D512
37	Kembang Tanjong	KECAMATAN	\N	\N	#E783BD
38	Keumala	KECAMATAN	\N	\N	#70BDE6
39	Sigli	KECAMATAN	\N	\N	#EA3EC7
40	Mila	KECAMATAN	\N	\N	#F3B29B
41	Mutiara	KECAMATAN	\N	\N	#4AD1D3
42	Mutiara Timur	KECAMATAN	\N	\N	#AAE892
43	Padang Tiji	KECAMATAN	\N	\N	#F193D6
44	Pidie	KECAMATAN	\N	\N	#A89EF5
45	Sakti	KECAMATAN	\N	\N	#6674DB
46	Simpang Tiga (Pidie)	KECAMATAN	\N	\N	#F93963
47	Titeu	KECAMATAN	\N	\N	#F6BE8E
48	Mane	KECAMATAN	\N	\N	#4CDCB5
49	Tangse	KECAMATAN	\N	\N	#89C1EB
50	Peukan Baro	KECAMATAN	\N	\N	#D855B1
51	Batee	KECAMATAN	\N	\N	#5747E6
52	Tiro/trusep	KECAMATAN	\N	\N	#F9B453
53	Arongan Lambalek	KECAMATAN	\N	\N	#96D760
54	Bubon	KECAMATAN	\N	\N	#5DB8F9
55	Johan Pahlawan	KECAMATAN	\N	\N	#F53250
56	Kaway Enambelas	KECAMATAN	\N	\N	#F4435E
57	Meurebo	KECAMATAN	\N	\N	#AD69DD
58	Pante Ceureumen	KECAMATAN	\N	\N	#9DE7E5
59	Panton Reu	KECAMATAN	\N	\N	#F10ED3
60	Samatiga	KECAMATAN	\N	\N	#DDE878
61	Sungaimas	KECAMATAN	\N	\N	#3BFC6B
62	Woyla	KECAMATAN	\N	\N	#6FFA29
63	Woyla Barat	KECAMATAN	\N	\N	#A5F80D
64	Woyla Timur	KECAMATAN	\N	\N	#7789E4
65	Babah Rot	KECAMATAN	\N	\N	#53E9D0
66	Blang Pidie	KECAMATAN	\N	\N	#AEA5E9
67	Jeumpa (Aceh Barat Daya)	KECAMATAN	\N	\N	#163CE9
68	Kuala Batee	KECAMATAN	\N	\N	#26B2FD
69	Lembah Sabil	KECAMATAN	\N	\N	#E25A4B
70	Manggeng	KECAMATAN	\N	\N	#E538C8
71	Setia	KECAMATAN	\N	\N	#4F9BF3
72	Susoh	KECAMATAN	\N	\N	#FB5BED
73	Tangan-tangan	KECAMATAN	\N	\N	#EC3CA8
74	Baitussalam	KECAMATAN	\N	\N	#4ED0DF
75	Blang Bintang	KECAMATAN	\N	\N	#85E5CD
76	Darul Imarah	KECAMATAN	\N	\N	#FB60EE
77	Darul Kamal	KECAMATAN	\N	\N	#8F89FB
78	Darussalam	KECAMATAN	\N	\N	#7D6DE3
79	Indrapuri	KECAMATAN	\N	\N	#FDB058
80	Ingin Jaya	KECAMATAN	\N	\N	#AA5BD7
81	Jantho	KECAMATAN	\N	\N	#6CB3EA
82	Krueng Barona Jaya	KECAMATAN	\N	\N	#B5A4EA
83	Kuta Baro	KECAMATAN	\N	\N	#D25F32
84	Kuta Cot Glie	KECAMATAN	\N	\N	#93CBE6
85	Kuta Malaka	KECAMATAN	\N	\N	#E9EC93
86	Lembah Seulawah	KECAMATAN	\N	\N	#94CFFA
87	Leupung	KECAMATAN	\N	\N	#B4DB24
88	Lhok Nga	KECAMATAN	\N	\N	#8FB9EF
89	Lhoong	KECAMATAN	\N	\N	#BCFE6C
90	Mesjid Raya	KECAMATAN	\N	\N	#FE6CEB
91	Montasik	KECAMATAN	\N	\N	#D385F9
92	Peukan Bada	KECAMATAN	\N	\N	#92EB7A
93	Pulo Aceh	KECAMATAN	\N	\N	#8FC7F5
94	Seulimeum	KECAMATAN	\N	\N	#D82FEE
95	Simpang Tiga (Aceh Besar)	KECAMATAN	\N	\N	#48D573
96	Sukamakmur	KECAMATAN	\N	\N	#A8E2EB
97	Darul Hikmah	KECAMATAN	\N	\N	#2ADBEF
98	Indra Jaya (Aceh Jaya)	KECAMATAN	\N	\N	#F56361
99	Jaya	KECAMATAN	\N	\N	#B3E28D
100	Krueng Sabee	KECAMATAN	\N	\N	#F62CAC
101	Panga	KECAMATAN	\N	\N	#B5F575
102	Pasie Raya	KECAMATAN	\N	\N	#9FED82
103	Sampoiniet	KECAMATAN	\N	\N	#715FE7
104	Setia Bakti	KECAMATAN	\N	\N	#601DE7
105	Teunom	KECAMATAN	\N	\N	#F8EB35
106	Bakongan	KECAMATAN	\N	\N	#78A1ED
107	Bakongan Timur	KECAMATAN	\N	\N	#DE9878
108	Kluet Selatan	KECAMATAN	\N	\N	#EB3D37
109	Kluet Tengah	KECAMATAN	\N	\N	#9E79FB
110	Kluet Timur	KECAMATAN	\N	\N	#EF1FE8
111	Kluet Utara	KECAMATAN	\N	\N	#F471E5
112	Kota Bahagia	KECAMATAN	\N	\N	#93ACF0
113	Labuhan Haji	KECAMATAN	\N	\N	#F15613
114	Labuhan Haji Barat	KECAMATAN	\N	\N	#F59166
115	Labuhan Haji Timur	KECAMATAN	\N	\N	#CF3FA9
116	Meukek	KECAMATAN	\N	\N	#5BF934
117	Pasie Raja	KECAMATAN	\N	\N	#3CC3EC
118	Samadua	KECAMATAN	\N	\N	#E9AD20
119	Sawang (Aceh Selatan)	KECAMATAN	\N	\N	#A93ED0
120	Tapaktuan	KECAMATAN	\N	\N	#BEF934
121	Trumon	KECAMATAN	\N	\N	#7888F2
123	Trumon Timur	KECAMATAN	\N	\N	#59D99B
124	Danau Paris	KECAMATAN	\N	\N	#F1C40E
125	Gunung Meriah	KECAMATAN	\N	\N	#A8F15B
126	Kepulauan Banyak	KECAMATAN	\N	\N	#B1EBA8
127	Kota Baharu	KECAMATAN	\N	\N	#AE7EF1
128	Kuala Baru	KECAMATAN	\N	\N	#DF6DD3
129	Simpang Kanan	KECAMATAN	\N	\N	#CC2DE1
130	Singkil	KECAMATAN	\N	\N	#7BD968
131	Singkil Utara	KECAMATAN	\N	\N	#F816E9
132	Singkohor	KECAMATAN	\N	\N	#F7F745
134	Pulau Banyak Barat	KECAMATAN	\N	\N	#5EDE98
135	Banda Mulia	KECAMATAN	\N	\N	#D7479B
136	Bandar Pusaka	KECAMATAN	\N	\N	#CF76EA
137	Bendahara	KECAMATAN	\N	\N	#D42B2E
138	Karang Baru	KECAMATAN	\N	\N	#7270DB
139	Kejuruan Muda	KECAMATAN	\N	\N	#D58148
140	Kuala Simpang	KECAMATAN	\N	\N	#EB7AA5
141	Manyak Payed	KECAMATAN	\N	\N	#F49FD8
142	Rantau	KECAMATAN	\N	\N	#F4AE71
143	Sekerak	KECAMATAN	\N	\N	#E679B9
144	Seruway	KECAMATAN	\N	\N	#83F40B
145	Tenggulun	KECAMATAN	\N	\N	#8DEAF6
146	Atu Lintang	KECAMATAN	\N	\N	#CF73DD
147	Bebesan	KECAMATAN	\N	\N	#73ED4A
148	Bies	KECAMATAN	\N	\N	#8CEEF3
149	Bintang	KECAMATAN	\N	\N	#0FFA27
150	Celala	KECAMATAN	\N	\N	#E6855B
152	Kebayakan	KECAMATAN	\N	\N	#3985D5
153	Ketol	KECAMATAN	\N	\N	#A4DC5B
154	Kute Panang	KECAMATAN	\N	\N	#EBF98A
155	Linge	KECAMATAN	\N	\N	#D65CB4
156	Laut Tawar	KECAMATAN	\N	\N	#A74DDB
157	Pegasing	KECAMATAN	\N	\N	#41E6AF
158	Rusip Antara	KECAMATAN	\N	\N	#FA3D95
159	Silih Nara	KECAMATAN	\N	\N	#F48686
160	Babul Makmur	KECAMATAN	\N	\N	#91F868
161	Babul Rahmah	KECAMATAN	\N	\N	#9328F0
162	Babussalam	KECAMATAN	\N	\N	#81B6DF
163	Badar	KECAMATAN	\N	\N	#36E62D
164	Bambel	KECAMATAN	\N	\N	#7EEDED
165	Bukit Tusam	KECAMATAN	\N	\N	#C4EF81
167	Deleng Pokhisen	KECAMATAN	\N	\N	#20F881
168	Ketambe	KECAMATAN	\N	\N	#F094E2
169	Lauser	KECAMATAN	\N	\N	#E944A4
170	Lawe Alas	KECAMATAN	\N	\N	#FA99DE
171	Lawe Bulan	KECAMATAN	\N	\N	#B6E33B
172	Lawe Sigala-gala	KECAMATAN	\N	\N	#656EF1
173	Lawe Sumur	KECAMATAN	\N	\N	#67FB04
174	Semadam	KECAMATAN	\N	\N	#F5808B
175	Tanoh Alas	KECAMATAN	\N	\N	#65E78C
176	Banda Alam	KECAMATAN	\N	\N	#D8A664
177	Biren Bayeun	KECAMATAN	\N	\N	#41EC7D
178	Darul Aman	KECAMATAN	\N	\N	#4ED84B
179	Darul Falah	KECAMATAN	\N	\N	#67F4FE
180	Darul Ihsan	KECAMATAN	\N	\N	#B18BF8
181	Idi Rayeuk	KECAMATAN	\N	\N	#DD4831
182	Idi Timur	KECAMATAN	\N	\N	#52E647
184	Indra Makmur	KECAMATAN	\N	\N	#94BEE5
185	Julok	KECAMATAN	\N	\N	#E93AB7
186	Madat	KECAMATAN	\N	\N	#DD3E22
187	Nurussalam	KECAMATAN	\N	\N	#F6BD83
188	Pante Bidari	KECAMATAN	\N	\N	#E596F8
189	Peudawa	KECAMATAN	\N	\N	#F2D66E
190	Peunaron	KECAMATAN	\N	\N	#3FF3E7
191	Peureulak	KECAMATAN	\N	\N	#FE394A
192	Peureulak Barat	KECAMATAN	\N	\N	#848DF6
193	Peureulak Timur	KECAMATAN	\N	\N	#BAF099
194	Ranto Peureulak	KECAMATAN	\N	\N	#B42AFE
195	Ranto Seulamat	KECAMATAN	\N	\N	#2054FE
196	Serbajadi	KECAMATAN	\N	\N	#DD93FB
197	Simpang Jernih	KECAMATAN	\N	\N	#4C60F6
198	Simpang Ulim	KECAMATAN	\N	\N	#F36A44
199	Sungai Raya	KECAMATAN	\N	\N	#37CDA8
200	Baktiya	KECAMATAN	\N	\N	#6AE5F6
202	Banda Baro	KECAMATAN	\N	\N	#E8874F
203	Cot Girek	KECAMATAN	\N	\N	#8FF726
204	Dewantara	KECAMATAN	\N	\N	#80EA9C
205	Geureundong Pase	KECAMATAN	\N	\N	#E935A7
206	Kuta Makmur	KECAMATAN	\N	\N	#D63DAB
207	Langkahan	KECAMATAN	\N	\N	#72E3AB
208	Lapang	KECAMATAN	\N	\N	#FD91AC
209	Lhoksukon	KECAMATAN	\N	\N	#F962B8
210	Matang Kuli	KECAMATAN	\N	\N	#5BE524
211	Meurah Mulia	KECAMATAN	\N	\N	#5082F7
212	Muara Batu	KECAMATAN	\N	\N	#EF3A15
213	Nibong	KECAMATAN	\N	\N	#7CE49B
214	Nisam	KECAMATAN	\N	\N	#64DF62
215	Nisam Antara	KECAMATAN	\N	\N	#4ADECF
216	Paya Bakong	KECAMATAN	\N	\N	#F42A96
218	Seunuddon	KECAMATAN	\N	\N	#3ADDF2
219	Simpang Keuramat	KECAMATAN	\N	\N	#8AA1E5
220	Syamtalira	KECAMATAN	\N	\N	#A83FF3
221	Syamtalira Aron	KECAMATAN	\N	\N	#74D454
222	Syamtalira Bayu	KECAMATAN	\N	\N	#EC7D6F
223	Tanah Jambo Ayee	KECAMATAN	\N	\N	#DD4B5C
224	Tanah Luas	KECAMATAN	\N	\N	#809EEA
225	Tanah Pasir	KECAMATAN	\N	\N	#DFDF6D
226	Sawang (Aceh Utara)	KECAMATAN	\N	\N	#FC22A5
227	Bandar	KECAMATAN	\N	\N	#30DF8D
228	Bener Kelipah	KECAMATAN	\N	\N	#E7404C
229	Bukit	KECAMATAN	\N	\N	#F8F368
230	Gajah Putih	KECAMATAN	\N	\N	#E1757A
231	Mesidah	KECAMATAN	\N	\N	#F25F92
232	Permata	KECAMATAN	\N	\N	#F48FFA
233	Pintu Rime Gayo	KECAMATAN	\N	\N	#A364FC
235	Timang Gajah	KECAMATAN	\N	\N	#F896AD
236	Wih Pesam	KECAMATAN	\N	\N	#F896BC
237	Gandapura	KECAMATAN	\N	\N	#898FFA
238	Jangka	KECAMATAN	\N	\N	#5204FB
239	Jeumpa (Bireuen)	KECAMATAN	\N	\N	#326BE7
240	Jeunib	KECAMATAN	\N	\N	#FA6BB3
241	Juli	KECAMATAN	\N	\N	#FE6B10
242	Kota Juang	KECAMATAN	\N	\N	#9E51F0
243	Kuala (Bireuen)	KECAMATAN	\N	\N	#78E8DB
244	Kuta Blang	KECAMATAN	\N	\N	#F8779C
245	Makmur	KECAMATAN	\N	\N	#DD5A88
246	Pandrah	KECAMATAN	\N	\N	#B2FC97
122	Trumon Tengah	KECAMATAN	\N	\N	#96D1F3
133	Suro Makmur	KECAMATAN	\N	\N	#E2FE94
151	Jagong Jeget	KECAMATAN	\N	\N	#0AFA96
166	Darul Hasanah	KECAMATAN	\N	\N	#D53FD0
183	Idi Tunong	KECAMATAN	\N	\N	#DAE953
201	Baktiya Barat	KECAMATAN	\N	\N	#EF884D
217	Pirak Timu	KECAMATAN	\N	\N	#A1A1ED
234	Syiah Utama	KECAMATAN	\N	\N	#AF9BF8
247	Peudada	KECAMATAN	\N	\N	#2DEB2D
248	Peulimbang	KECAMATAN	\N	\N	#C252FE
249	Peusangan	KECAMATAN	\N	\N	#B988E7
250	Peusangan Selatan	KECAMATAN	\N	\N	#9547D1
251	Peusangan Siblah Krueng	KECAMATAN	\N	\N	#3B38FA
252	Samalanga	KECAMATAN	\N	\N	#EED190
253	Simpang Mamplam	KECAMATAN	\N	\N	#F98E0B
254	Blangjerango	KECAMATAN	\N	\N	#B5E47C
255	Blangkejeren	KECAMATAN	\N	\N	#E260C6
256	Blangpegayon	KECAMATAN	\N	\N	#DD36A8
257	Dabun Gelang	KECAMATAN	\N	\N	#63C0F2
258	Kuta Panjang	KECAMATAN	\N	\N	#D53F49
259	Pantan Cuaca	KECAMATAN	\N	\N	#E8906D
260	Pining	KECAMATAN	\N	\N	#3B68FC
261	Putri Betung	KECAMATAN	\N	\N	#655EE8
262	Rikit Gaib	KECAMATAN	\N	\N	#B39AF9
263	Terangun	KECAMATAN	\N	\N	#FE3481
264	Tripe Jaya	KECAMATAN	\N	\N	#8EF6C5
265	Baiturrahman	KECAMATAN	\N	\N	#E35F63
266	Banda Raya	KECAMATAN	\N	\N	#D84BB4
267	Jaya Baru	KECAMATAN	\N	\N	#FDD74E
268	Kuta Alam	KECAMATAN	\N	\N	#F896F3
269	Kuta Raja	KECAMATAN	\N	\N	#7C6DEE
270	Lueng Bata	KECAMATAN	\N	\N	#E26C22
271	Meuraxa	KECAMATAN	\N	\N	#F060AF
272	Syiah Kuala	KECAMATAN	\N	\N	#F78DE0
273	Ulee Kareng	KECAMATAN	\N	\N	#FE3977
274	Langsa Barat	KECAMATAN	\N	\N	#F4562A
275	Langsa Baro	KECAMATAN	\N	\N	#6C87EA
276	Langsa Kota	KECAMATAN	\N	\N	#95EFCC
277	Langsa Lama	KECAMATAN	\N	\N	#8482F7
278	Langsa Timur	KECAMATAN	\N	\N	#73E8AD
279	Banda Sakti	KECAMATAN	\N	\N	#97F2CA
280	Blang Mangat	KECAMATAN	\N	\N	#CEA6ED
281	Muara Dua	KECAMATAN	\N	\N	#E863FD
282	Muara Satu	KECAMATAN	\N	\N	#68EE7E
283	Sukakarya	KECAMATAN	\N	\N	#4DFEC6
284	Sukajarya	KECAMATAN	\N	\N	#CB7EFC
285	Longkip	KECAMATAN	\N	\N	#7B7FE5
286	Penanggalan	KECAMATAN	\N	\N	#6CAEFE
287	Rundeng	KECAMATAN	\N	\N	#EE8AF5
288	Simpang Kiri	KECAMATAN	\N	\N	#85E597
289	Sultan Daulat	KECAMATAN	\N	\N	#FBE58E
290	Beutong	KECAMATAN	\N	\N	#DF72B0
291	Beutong Ateuh Benggalang	KECAMATAN	\N	\N	#2C77D8
292	Darul Makmur	KECAMATAN	\N	\N	#4DF58D
293	Kuala (Nagan Raya)	KECAMATAN	\N	\N	#9B80E0
294	Kuala Pesisir	KECAMATAN	\N	\N	#2CDBE8
295	Seunagan	KECAMATAN	\N	\N	#73E2BA
296	Seunagan Timur	KECAMATAN	\N	\N	#8AFC78
297	Suka Makmue	KECAMATAN	\N	\N	#91A3E3
298	Tadu Raya	KECAMATAN	\N	\N	#EDC31D
299	Tripa Makmur	KECAMATAN	\N	\N	#D3317F
300	Alafan	KECAMATAN	\N	\N	#1D86E2
301	Salang	KECAMATAN	\N	\N	#AA51E6
302	Simeulue Barat	KECAMATAN	\N	\N	#71F4E7
303	Simeulue Tengah	KECAMATAN	\N	\N	#CF6EE7
304	Simeulue Timur	KECAMATAN	\N	\N	#3FF858
305	Teluk Dalam	KECAMATAN	\N	\N	#7CF358
306	Teupah Barat	KECAMATAN	\N	\N	#95F81B
307	Teupah Selatan	KECAMATAN	\N	\N	#D9995E
308	Tamiang Hulu	KECAMATAN	\N	\N	#F236EF
309	Bandar Baru	KECAMATAN	\N	\N	#32F145
310	Bandar Dua	KECAMATAN	\N	\N	#F64C73
311	Jangka Buya	KECAMATAN	\N	\N	#28EB3C
312	Meurah Dua	KECAMATAN	\N	\N	#6DF637
313	Meureudu	KECAMATAN	\N	\N	#8BCBF9
314	Pante Raja	KECAMATAN	\N	\N	#2C96DD
315	Trienggadeng	KECAMATAN	\N	\N	#F85DD9
316	Ulim	KECAMATAN	\N	\N	#8EECE7
\.


--
-- Name: berita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.berita_id_seq', 17, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.faqs_id_seq', 8, true);


--
-- Name: fitur_unggulan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.fitur_unggulan_id_seq', 11, true);


--
-- Name: footer_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.footer_configs_id_seq', 4, true);


--
-- Name: hero_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.hero_contents_id_seq', 12, true);


--
-- Name: hero_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.hero_stats_id_seq', 14, true);


--
-- Name: logo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.logo_id_seq', 7, true);


--
-- Name: navbar_menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.navbar_menus_id_seq', 12, true);


--
-- Name: tentang_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.tentang_contents_id_seq', 6, true);


--
-- Name: tentang_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.tentang_points_id_seq', 7, true);


--
-- Name: wilayah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_inpeta
--

SELECT pg_catalog.setval('public.wilayah_id_seq', 316, true);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: berita berita_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.berita
    ADD CONSTRAINT berita_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: fasilitas fasilitas_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.fasilitas
    ADD CONSTRAINT fasilitas_pkey PRIMARY KEY (id);


--
-- Name: fitur_unggulan fitur_unggulan_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.fitur_unggulan
    ADD CONSTRAINT fitur_unggulan_pkey PRIMARY KEY (id);


--
-- Name: footer_configs footer_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.footer_configs
    ADD CONSTRAINT footer_configs_pkey PRIMARY KEY (id);


--
-- Name: hero_contents hero_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.hero_contents
    ADD CONSTRAINT hero_contents_pkey PRIMARY KEY (id);


--
-- Name: hero_stats hero_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.hero_stats
    ADD CONSTRAINT hero_stats_pkey PRIMARY KEY (id);


--
-- Name: logo logo_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.logo
    ADD CONSTRAINT logo_pkey PRIMARY KEY (id);


--
-- Name: navbar_menus navbar_menus_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.navbar_menus
    ADD CONSTRAINT navbar_menus_pkey PRIMARY KEY (id);


--
-- Name: pengaturan_web pengaturan_web_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.pengaturan_web
    ADD CONSTRAINT pengaturan_web_pkey PRIMARY KEY (id);


--
-- Name: populasi populasi_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.populasi
    ADD CONSTRAINT populasi_pkey PRIMARY KEY (id);


--
-- Name: tentang_contents tentang_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.tentang_contents
    ADD CONSTRAINT tentang_contents_pkey PRIMARY KEY (id);


--
-- Name: tentang_points tentang_points_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.tentang_points
    ADD CONSTRAINT tentang_points_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wilayah wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.wilayah
    ADD CONSTRAINT wilayah_pkey PRIMARY KEY (id);


--
-- Name: api_keys_key_key; Type: INDEX; Schema: public; Owner: admin_inpeta
--

CREATE UNIQUE INDEX api_keys_key_key ON public.api_keys USING btree (key);


--
-- Name: populasi_wilayah_id_tahun_key; Type: INDEX; Schema: public; Owner: admin_inpeta
--

CREATE UNIQUE INDEX populasi_wilayah_id_tahun_key ON public.populasi USING btree (wilayah_id, tahun);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: admin_inpeta
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: fasilitas fasilitas_wilayah_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.fasilitas
    ADD CONSTRAINT fasilitas_wilayah_id_fkey FOREIGN KEY (wilayah_id) REFERENCES public.wilayah(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: navbar_menus navbar_menus_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.navbar_menus
    ADD CONSTRAINT navbar_menus_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.navbar_menus(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: populasi populasi_wilayah_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_inpeta
--

ALTER TABLE ONLY public.populasi
    ADD CONSTRAINT populasi_wilayah_id_fkey FOREIGN KEY (wilayah_id) REFERENCES public.wilayah(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: admin_inpeta
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

