#!/usr/bin/env python3
"""
ETL Load Module for SOKO E-commerce Analytics

This module handles data loading to various destinations:
- PostgreSQL data warehouse
- MongoDB collections
- Elasticsearch indexes
- CSV/Parquet files
- Data visualization tools
"""

import pandas as pd
import psycopg2
from pymongo import MongoClient
from elasticsearch import Elasticsearch
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self):
        self.postgres_config = {
            'host': os.getenv('POSTGRES_HOST', 'localhost'),
            'port': os.getenv('POSTGRES_PORT', '5432'),
            'database': os.getenv('POSTGRES_DW_DB', 'soko_dw'),
            'user': os.getenv('POSTGRES_USER', 'postgres'),
            'password': os.getenv('POSTGRES_PASSWORD', 'password')
        }

        self.mongo_config = {
            'host': os.getenv('MONGO_HOST', 'localhost'),
            'port': int(os.getenv('MONGO_PORT', '27017')),
            'database': os.getenv('MONGO_ANALYTICS_DB', 'soko_analytics'),
            'username': os.getenv('MONGO_USER'),
            'password': os.getenv('MONGO_PASSWORD')
        }

        self.es_config = {
            'host': os.getenv('ES_HOST', 'localhost'),
            'port': int(os.getenv('ES_PORT', '9200')),
            'scheme': os.getenv('ES_SCHEME', 'http')
        }

    def load_to_postgres(self, df: pd.DataFrame, table_name: str,
                        if_exists: str = 'replace', index: bool = True) -> None:
        """
        Load DataFrame to PostgreSQL table

        Args:
            df: DataFrame to load
            table_name: Target table name
            if_exists: Action if table exists ('replace', 'append', 'fail')
            index: Whether to create indexes on load
        """
        try:
            conn = psycopg2.connect(**self.postgres_config)

            # Create table if not exists
            if if_exists == 'replace':
                self._create_table_from_df(conn, table_name, df)

            # Load data
            df.to_sql(table_name, conn, if_exists=if_exists, index=index)

            conn.close()
            logger.info(f"Loaded {len(df)} rows to PostgreSQL table: {table_name}")

        except Exception as e:
            logger.error(f"Error loading to PostgreSQL: {e}")
            raise

    def _create_table_from_df(self, conn, table_name: str, df: pd.DataFrame) -> None:
        """Create PostgreSQL table from DataFrame schema"""
        cursor = conn.cursor()

        # Drop table if exists
        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")

        # Create table
        columns = []
        for col, dtype in df.dtypes.items():
            if dtype == 'object':
                sql_type = 'TEXT'
            elif dtype == 'int64':
                sql_type = 'BIGINT'
            elif dtype == 'float64':
                sql_type = 'DOUBLE PRECISION'
            elif dtype == 'bool':
                sql_type = 'BOOLEAN'
            elif 'datetime' in str(dtype):
                sql_type = 'TIMESTAMP'
            else:
                sql_type = 'TEXT'

            columns.append(f'"{col}" {sql_type}')

        create_query = f"CREATE TABLE {table_name} ({', '.join(columns)})"
        cursor.execute(create_query)
        conn.commit()
        cursor.close()

    def load_to_mongo(self, df: pd.DataFrame, collection_name: str,
                     if_exists: str = 'replace') -> None:
        """
        Load DataFrame to MongoDB collection

        Args:
            df: DataFrame to load
            collection_name: Target collection name
            if_exists: Action if collection exists ('replace', 'append')
        """
        try:
            client = MongoClient(**self.mongo_config)
            db = client[self.mongo_config['database']]
            collection = db[collection_name]

            if if_exists == 'replace':
                collection.drop()

            # Convert DataFrame to list of dicts
            records = df.to_dict('records')

            if records:
                collection.insert_many(records)

            client.close()
            logger.info(f"Loaded {len(records)} documents to MongoDB collection: {collection_name}")

        except Exception as e:
            logger.error(f"Error loading to MongoDB: {e}")
            raise

    def load_to_elasticsearch(self, df: pd.DataFrame, index_name: str,
                            id_column: Optional[str] = None) -> None:
        """
        Load DataFrame to Elasticsearch index

        Args:
            df: DataFrame to load
            index_name: Target index name
            id_column: Column to use as document ID
        """
        try:
            es = Elasticsearch([self.es_config])

            # Prepare bulk data
            bulk_data = []
            for _, row in df.iterrows():
                doc = row.to_dict()

                # Convert numpy types to Python types
                for key, value in doc.items():
                    if pd.isna(value):
                        doc[key] = None
                    elif hasattr(value, 'item'):  # numpy types
                        doc[key] = value.item()

                bulk_data.append({
                    '_index': index_name,
                    '_id': str(doc[id_column]) if id_column and id_column in doc else None,
                    '_source': doc
                })

            # Bulk insert
            if bulk_data:
                from elasticsearch.helpers import bulk
                bulk(es, bulk_data)

            logger.info(f"Loaded {len(bulk_data)} documents to Elasticsearch index: {index_name}")

        except Exception as e:
            logger.error(f"Error loading to Elasticsearch: {e}")
            raise

    def load_to_csv(self, df: pd.DataFrame, file_path: str, **kwargs) -> None:
        """
        Load DataFrame to CSV file

        Args:
            df: DataFrame to load
            file_path: Output file path
            **kwargs: Additional pandas to_csv arguments
        """
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            df.to_csv(file_path, index=False, **kwargs)
            logger.info(f"Loaded {len(df)} rows to CSV: {file_path}")

        except Exception as e:
            logger.error(f"Error loading to CSV: {e}")
            raise

    def load_to_parquet(self, df: pd.DataFrame, file_path: str, **kwargs) -> None:
        """
        Load DataFrame to Parquet file

        Args:
            df: DataFrame to load
            file_path: Output file path
            **kwargs: Additional pandas to_parquet arguments
        """
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            df.to_parquet(file_path, index=False, **kwargs)
            logger.info(f"Loaded {len(df)} rows to Parquet: {file_path}")

        except Exception as e:
            logger.error(f"Error loading to Parquet: {e}")
            raise

    def load_customer_metrics(self, customer_df: pd.DataFrame) -> None:
        """
        Load customer metrics to data warehouse

        Args:
            customer_df: DataFrame with customer metrics
        """
        # Load to PostgreSQL
        self.load_to_postgres(customer_df, 'customer_metrics', 'replace')

        # Load to Elasticsearch for search
        self.load_to_elasticsearch(customer_df, 'customers', 'customer_id')

        # Load summary to MongoDB
        summary = {
            'total_customers': len(customer_df),
            'avg_lifetime_value': customer_df['total_spent'].mean(),
            'total_revenue': customer_df['total_spent'].sum(),
            'generated_at': datetime.now().isoformat()
        }

        summary_df = pd.DataFrame([summary])
        self.load_to_mongo(summary_df, 'customer_summary')

    def load_product_metrics(self, product_df: pd.DataFrame) -> None:
        """
        Load product metrics to data warehouse

        Args:
            product_df: DataFrame with product metrics
        """
        # Load to PostgreSQL
        self.load_to_postgres(product_df, 'product_metrics', 'replace')

        # Load to Elasticsearch for search
        self.load_to_elasticsearch(product_df, 'products', 'product_id')

        # Load top products to MongoDB
        top_products = product_df.nlargest(10, 'total_revenue').to_dict('records')
        top_df = pd.DataFrame(top_products)
        self.load_to_mongo(top_df, 'top_products')

    def load_sales_data(self, sales_df: pd.DataFrame) -> None:
        """
        Load sales data with aggregations

        Args:
            sales_df: DataFrame with sales data
        """
        # Load raw data
        self.load_to_postgres(sales_df, 'sales_transactions', 'replace')

        # Create daily aggregations
        sales_df['date'] = pd.to_datetime(sales_df['created_at']).dt.date
        daily_sales = sales_df.groupby('date').agg({
            'total_amount': 'sum',
            'order_id': 'count'
        }).reset_index()

        daily_sales.columns = ['date', 'total_revenue', 'total_orders']
        self.load_to_postgres(daily_sales, 'daily_sales_summary', 'replace')

        # Create monthly aggregations
        sales_df['month'] = pd.to_datetime(sales_df['created_at']).dt.to_period('M')
        monthly_sales = sales_df.groupby('month').agg({
            'total_amount': 'sum',
            'order_id': 'count'
        }).reset_index()

        monthly_sales.columns = ['month', 'total_revenue', 'total_orders']
        monthly_sales['month'] = monthly_sales['month'].astype(str)
        self.load_to_postgres(monthly_sales, 'monthly_sales_summary', 'replace')

    def create_dashboard_data(self, customer_df: pd.DataFrame,
                            product_df: pd.DataFrame, sales_df: pd.DataFrame) -> None:
        """
        Create and load dashboard-ready data

        Args:
            customer_df: Customer metrics DataFrame
            product_df: Product metrics DataFrame
            sales_df: Sales data DataFrame
        """
        dashboard_data = {
            'summary': {
                'total_customers': len(customer_df),
                'total_products': len(product_df),
                'total_revenue': sales_df['total_amount'].sum() if 'total_amount' in sales_df.columns else 0,
                'total_orders': len(sales_df),
                'avg_order_value': sales_df['total_amount'].mean() if 'total_amount' in sales_df.columns else 0,
                'generated_at': datetime.now().isoformat()
            },
            'top_customers': customer_df.nlargest(5, 'total_spent')[['customer_id', 'name', 'total_spent']].to_dict('records'),
            'top_products': product_df.nlargest(5, 'total_revenue')[['name', 'total_revenue', 'total_quantity_sold']].to_dict('records'),
            'sales_trend': sales_df.groupby(pd.to_datetime(sales_df['created_at']).dt.date)['total_amount'].sum().reset_index().to_dict('records') if 'created_at' in sales_df.columns and 'total_amount' in sales_df.columns else []
        }

        # Save to JSON for dashboard consumption
        dashboard_file = os.path.join(os.getcwd(), 'analytics', 'reports', 'dashboards', 'dashboard_data.json')
        os.makedirs(os.path.dirname(dashboard_file), exist_ok=True)

        with open(dashboard_file, 'w') as f:
            json.dump(dashboard_data, f, indent=2, default=str)

        logger.info(f"Created dashboard data file: {dashboard_file}")

        # Also load summary to MongoDB for real-time dashboards
        summary_df = pd.DataFrame([dashboard_data['summary']])
        self.load_to_mongo(summary_df, 'dashboard_summary')

if __name__ == "__main__":
    loader = DataLoader()

    # Example usage with sample data
    try:
        # Sample customer data
        customer_data = pd.DataFrame({
            'customer_id': [1, 2, 3],
            'name': ['John Doe', 'Jane Smith', 'Bob Johnson'],
            'total_spent': [429.97, 299.99, 129.99],
            'total_orders': [2, 1, 1],
            'registration_date': pd.date_range('2024-01-01', periods=3)
        })

        # Load customer metrics
        loader.load_customer_metrics(customer_data)
        print("Loaded customer metrics")

        # Sample product data
        product_data = pd.DataFrame({
            'product_id': [1, 2, 3],
            'name': ['Wireless Headphones', 'Smart Watch', 'Coffee Maker'],
            'total_revenue': [259.98, 299.99, 89.99],
            'total_quantity_sold': [2, 1, 1],
            'category': ['Electronics', 'Electronics', 'Home & Kitchen']
        })

        # Load product metrics
        loader.load_product_metrics(product_data)
        print("Loaded product metrics")

    except Exception as e:
        logger.error(f"Loading failed: {e}")