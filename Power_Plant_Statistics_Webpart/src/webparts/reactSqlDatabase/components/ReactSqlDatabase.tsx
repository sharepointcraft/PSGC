import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./ReactSqlDatabase.module.scss";
import type { IReactSqlDatabaseProps } from "./IReactSqlDatabaseProps";
import { HttpClient, HttpClientResponse } from "@microsoft/sp-http";

interface IProduct {
  Net_MWh: number;
  Unit_Number: number;
  NOX_ppm: number;
  SO2_ppm: number;
  CO_ppm: number;
}

const ReactSqlDatabase: React.FC<IReactSqlDatabaseProps> = ({ context }) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = async (): Promise<void> => {
    try {
      console.log("Fetching data from API...");
      const response: HttpClientResponse = await context.httpClient.get(
        "https://psgcfunctionapp-g3c4dgb7b2ghh9ht.eastus-01.azurewebsites.net/api/getpowerplantdata",
        HttpClient.configurations.v1
      );

      console.log("Raw response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: IProduct[] = await response.json();
      console.log("Response JSON data:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.tableTitle}>Unit Stats</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th className={styles.fixedColumn}></th>
              {products.slice(0, 5).map((product, index) => (
                <th key={index} className={styles.scrollableColumn}>
                  Unit {product.Unit_Number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.fixedColumn}>Net MWh</td>
              {products.slice(0, 5).map((product, index) => (
                <td key={index} className={styles.scrollableColumn}>{product.Net_MWh}</td>
              ))}
            </tr>
            <tr>
              <td className={styles.fixedColumn}>NOX ppm</td>
              {products.slice(0, 5).map((product, index) => (
                <td key={index} className={styles.scrollableColumn}>{product.NOX_ppm}</td>
              ))}
            </tr>
            <tr>
              <td className={styles.fixedColumn}>SO2 ppm</td>
              {products.slice(0, 5).map((product, index) => (
                <td key={index} className={styles.scrollableColumn}>{product.SO2_ppm.toFixed(2)}</td>
              ))}
            </tr>
            <tr>
              <td className={styles.fixedColumn}>CO ppm</td>
              {products.slice(0, 5).map((product, index) => (
                <td key={index} className={styles.scrollableColumn}>{product.CO_ppm}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReactSqlDatabase;
