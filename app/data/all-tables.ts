export type Table = {
	/**
	 * テーブル名
	 */
	name: string;

	/**
	 * テーブル定義
	 */
	def: string;
};

export const allTables: Table[] = [
	{
		name: "customer",
		def: `
DROP TABLE IF EXISTS customer;
CREATE TABLE customer(
	customer_id            VARCHAR(14),
	customer_name          VARCHAR(20),
	gender_cd              VARCHAR(1),
	gender                 VARCHAR(2),
	birth_day              DATE,
	age                    INTEGER,
	postal_cd              VARCHAR(8),
	address                VARCHAR(128),
	application_store_cd   VARCHAR(6),
	application_date       VARCHAR(8),
	status_cd              VARCHAR(12),
	PRIMARY KEY (customer_id)
);
`,
	},
	{
		name: "category",
		def: `
DROP TABLE IF EXISTS category;
CREATE TABLE category(
	category_major_cd     VARCHAR(2),
	category_major_name   VARCHAR(32),
	category_medium_cd    VARCHAR(4),
	category_medium_name  VARCHAR(32),
	category_small_cd     VARCHAR(6),
	category_small_name   VARCHAR(32),
	PRIMARY KEY (category_small_cd)
);
`,
	},
	{
		name: "product",
		def: `
DROP TABLE IF EXISTS product;
CREATE TABLE product(
	product_cd            VARCHAR(10),
	category_major_cd     VARCHAR(2),
	category_medium_cd    VARCHAR(4),
	category_small_cd     VARCHAR(6),
	unit_price            INTEGER,
	unit_cost             INTEGER,
	PRIMARY KEY (product_cd)
);
`,
	},
	{
		name: "store",
		def: `
DROP TABLE IF EXISTS store;
CREATE TABLE store(
	store_cd      VARCHAR(6),
	store_name    VARCHAR(128),
	prefecture_cd VARCHAR(2),
	prefecture    VARCHAR(5),
	address       VARCHAR(128),
	address_kana  VARCHAR(128),
	tel_no        VARCHAR(20),
	longitude     NUMERIC,
	latitude      NUMERIC,
	floor_area    NUMERIC,
	PRIMARY KEY (store_cd)
);
`,
	},
	{
		name: "receipt",
		def: `
DROP TABLE IF EXISTS receipt;
CREATE TABLE receipt(
	sales_ymd       INTEGER,
	sales_epoch     INTEGER,
	store_cd        VARCHAR(6),
	receipt_no      SMALLINT,
	receipt_sub_no  SMALLINT,
	customer_id     VARCHAR(14),
	product_cd      VARCHAR(10),
	quantity        INTEGER,
	amount          INTEGER,
	PRIMARY KEY (sales_ymd, store_cd, receipt_no, receipt_sub_no)
);
`,
	},
];
