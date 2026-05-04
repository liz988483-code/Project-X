#!/usr/bin/env python3
"""
ETL Extract Module for SOKO E-commerce Analytics

This module handles data extraction from various sources:
- PostgreSQL database
- MongoDB collections
- API endpoints
- CSV/JSON files
"""

import pandas as pd
import psycopg2
from pymongo import MongoClient
import requests
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataExtractor:
    def __init__(self):
        self.postgres_config = {
            'host': os.getenv('POSTGRES_HOST', 'localhost'),
            'port': os.getenv('POSTGRES_PORT', '5432'),
            'database': os.getenv('POSTGRES_DB', 'soko'),
            'user': os.getenv('POSTGRES_USER', 'postgres'),
            'password': os.getenv('POSTGRES_PASSWORD', 'password')
        }

        self.mongo_config = {
            'host': os.getenv('MONGO_HOST', 'localhost'),
            'port': int(os.getenv('MONGO_PORT', '27017')),
            'database': os.getenv('MONGO_DB', 'soko'),
            'username': os.getenv('MONGO_USER'),
            'password': os.getenv('MONGO_PASSWORD')
        }

    def extract_from_postgres(self, query: str, params: Optional[tuple] = None) -> pd.DataFrame:
        """
        Extract data from PostgreSQL database

        Args:
            query: SQL query to execute
            params: Query parameters

        Returns:
            DataFrame with query results
        """
        try:
            conn = psycopg2.connect(**self.postgres_config)
            df = pd.read_sql_query(query, conn, params=params)
            conn.close()
            logger.info(f"Extracted {len(df)} rows from PostgreSQL")
            return df
        except Exception as e:
            logger.error(f"Error extracting from PostgreSQL: {e}")
            raise

    def extract_from_mongo(self, collection_name: str, query: Optional[Dict] = None,
                          projection: Optional[Dict] = None) -> pd.DataFrame:
        """
        Extract data from MongoDB collection

        Args:
            collection_name: Name of the collection
            query: MongoDB query filter
            projection: Fields to include/exclude

        Returns:
            DataFrame with collection data
        """
        try:
            client = MongoClient(**self.mongo_config)
            db = client[self.mongo_config['database']]
            collection = db[collection_name]

            cursor = collection.find(query or {}, projection or {})
            data = list(cursor)

            client.close()

            if data:
                df = pd.DataFrame(data)
                # Convert ObjectId to string
                if '_id' in df.columns:
                    df['_id'] = df['_id'].astype(str)
            else:
                df = pd.DataFrame()

            logger.info(f"Extracted {len(df)} documents from MongoDB collection {collection_name}")
            return df
        except Exception as e:
            logger.error(f"Error extracting from MongoDB: {e}")
            raise

    def extract_from_api(self, url: str, headers: Optional[Dict] = None,
                        params: Optional[Dict] = None) -> Dict:
        """
        Extract data from REST API

        Args:
            url: API endpoint URL
            headers: Request headers
            params: Query parameters

        Returns:
            API response data
        """
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Extracted data from API: {url}")
            return data
        except Exception as e:
            logger.error(f"Error extracting from API: {e}")
            raise

    def extract_from_csv(self, file_path: str, **kwargs) -> pd.DataFrame:
        """
        Extract data from CSV file

        Args:
            file_path: Path to CSV file
            **kwargs: Additional pandas read_csv arguments

        Returns:
            DataFrame with CSV data
        """
        try:
            df = pd.read_csv(file_path, **kwargs)
            logger.info(f"Extracted {len(df)} rows from CSV: {file_path}")
            return df
        except Exception as e:
            logger.error(f"Error extracting from CSV: {e}")
            raise

    def extract_from_json(self, file_path: str) -> pd.DataFrame:
        """
        Extract data from JSON file

        Args:
            file_path: Path to JSON file

        Returns:
            DataFrame with JSON data
        """
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)

            if isinstance(data, list):
                df = pd.DataFrame(data)
            else:
                df = pd.DataFrame([data])

            logger.info(f"Extracted {len(df)} records from JSON: {file_path}")
            return df
        except Exception as e:
            logger.error(f"Error extracting from JSON: {e}")
            raise

    def extract_recent_orders(self, days: int = 30) -> pd.DataFrame:
        """
        Extract recent orders from database

        Args:
            days: Number of days to look back

        Returns:
            DataFrame with recent orders
        """
        query = """
        SELECT
            o.id,
            o.order_number,
            o.total_amount,
            o.status,
            o.created_at,
            u.name as customer_name,
            u.email as customer_email,
            COUNT(oi.id) as item_count
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.created_at >= %s
        GROUP BY o.id, u.name, u.email
        ORDER BY o.created_at DESC
        """

        cutoff_date = datetime.now() - timedelta(days=days)
        return self.extract_from_postgres(query, (cutoff_date,))

    def extract_product_performance(self) -> pd.DataFrame:
        """
        Extract product performance metrics

        Returns:
            DataFrame with product performance data
        """
        query = """
        SELECT
            p.id,
            p.name,
            p.price,
            c.name as category,
            COALESCE(SUM(oi.quantity), 0) as total_sold,
            COALESCE(SUM(oi.total_price), 0) as total_revenue,
            COALESCE(AVG(r.rating), 0) as avg_rating,
            COUNT(r.id) as review_count,
            p.stock_quantity,
            p.created_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.is_active = true
        GROUP BY p.id, c.name
        ORDER BY total_revenue DESC
        """

        return self.extract_from_postgres(query)

    def extract_customer_behavior(self) -> pd.DataFrame:
        """
        Extract customer behavior analytics

        Returns:
            DataFrame with customer behavior data
        """
        query = """
        SELECT
            u.id,
            u.name,
            u.email,
            u.created_at as registration_date,
            COUNT(DISTINCT o.id) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as total_spent,
            COALESCE(AVG(o.total_amount), 0) as avg_order_value,
            MAX(o.created_at) as last_order_date,
            COUNT(DISTINCT oi.product_id) as unique_products_purchased,
            COUNT(r.id) as review_count
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN reviews r ON u.id = r.user_id
        GROUP BY u.id, u.name, u.email, u.created_at
        ORDER BY total_spent DESC
        """

        return self.extract_from_postgres(query)

if __name__ == "__main__":
    extractor = DataExtractor()

    # Example usage
    try:
        # Extract recent orders
        orders_df = extractor.extract_recent_orders(7)
        print(f"Recent orders: {len(orders_df)} records")

        # Extract product performance
        products_df = extractor.extract_product_performance()
        print(f"Product performance: {len(products_df)} records")

        # Extract customer behavior
        customers_df = extractor.extract_customer_behavior()
        print(f"Customer behavior: {len(customers_df)} records")

    except Exception as e:
        logger.error(f"Extraction failed: {e}")