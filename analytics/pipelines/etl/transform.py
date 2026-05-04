#!/usr/bin/env python3
"""
ETL Transform Module for SOKO E-commerce Analytics

This module handles data transformation and cleansing:
- Data validation and cleaning
- Feature engineering
- Aggregation and summarization
- Data normalization
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Any, Optional
import re

logger = logging.getLogger(__name__)

class DataTransformer:
    def __init__(self):
        self.categorical_mappings = {
            'order_status': {
                'pending': 1,
                'confirmed': 2,
                'processing': 3,
                'shipped': 4,
                'delivered': 5,
                'cancelled': 6,
                'refunded': 7
            },
            'product_category': {
                'Electronics': 1,
                'Fashion': 2,
                'Home & Kitchen': 3,
                'Sports': 4,
                'Books': 5,
                'Beauty': 6,
                'Toys': 7,
                'Automotive': 8
            }
        }

    def clean_text_data(self, df: pd.DataFrame, text_columns: List[str]) -> pd.DataFrame:
        """
        Clean text data by removing special characters and normalizing

        Args:
            df: Input DataFrame
            text_columns: List of column names to clean

        Returns:
            DataFrame with cleaned text columns
        """
        df_clean = df.copy()

        for col in text_columns:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].astype(str).apply(self._clean_text)

        logger.info(f"Cleaned text data for columns: {text_columns}")
        return df_clean

    def _clean_text(self, text: str) -> str:
        """Clean individual text string"""
        if pd.isna(text):
            return ''

        # Remove special characters but keep spaces and basic punctuation
        text = re.sub(r'[^\w\s\-.,!?\']', '', text)

        # Normalize whitespace
        text = ' '.join(text.split())

        return text.strip().lower()

    def handle_missing_values(self, df: pd.DataFrame, strategy: Dict[str, str]) -> pd.DataFrame:
        """
        Handle missing values based on specified strategy

        Args:
            df: Input DataFrame
            strategy: Dict mapping column names to strategies ('drop', 'mean', 'median', 'mode', 'zero', 'unknown')

        Returns:
            DataFrame with handled missing values
        """
        df_clean = df.copy()

        for col, strat in strategy.items():
            if col not in df_clean.columns:
                continue

            if strat == 'drop':
                df_clean = df_clean.dropna(subset=[col])
            elif strat == 'mean' and df_clean[col].dtype in ['int64', 'float64']:
                df_clean[col] = df_clean[col].fillna(df_clean[col].mean())
            elif strat == 'median' and df_clean[col].dtype in ['int64', 'float64']:
                df_clean[col] = df_clean[col].fillna(df_clean[col].median())
            elif strat == 'mode':
                df_clean[col] = df_clean[col].fillna(df_clean[col].mode().iloc[0] if not df_clean[col].mode().empty else 'unknown')
            elif strat == 'zero':
                df_clean[col] = df_clean[col].fillna(0)
            elif strat == 'unknown':
                df_clean[col] = df_clean[col].fillna('unknown')

        logger.info(f"Handled missing values using strategy: {strategy}")
        return df_clean

    def normalize_numeric_data(self, df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
        """
        Normalize numeric columns using min-max scaling

        Args:
            df: Input DataFrame
            columns: List of numeric columns to normalize

        Returns:
            DataFrame with normalized columns
        """
        df_norm = df.copy()

        for col in columns:
            if col in df_norm.columns and df_norm[col].dtype in ['int64', 'float64']:
                min_val = df_norm[col].min()
                max_val = df_norm[col].max()

                if max_val > min_val:
                    df_norm[f'{col}_normalized'] = (df_norm[col] - min_val) / (max_val - min_val)

        logger.info(f"Normalized numeric columns: {columns}")
        return df_norm

    def encode_categorical_data(self, df: pd.DataFrame, columns: List[str],
                               method: str = 'label') -> pd.DataFrame:
        """
        Encode categorical columns

        Args:
            df: Input DataFrame
            columns: List of categorical columns
            method: Encoding method ('label', 'onehot')

        Returns:
            DataFrame with encoded columns
        """
        df_encoded = df.copy()

        for col in columns:
            if col not in df_encoded.columns:
                continue

            if method == 'label':
                # Use predefined mappings if available
                if col in self.categorical_mappings:
                    mapping = self.categorical_mappings[col]
                    df_encoded[f'{col}_encoded'] = df_encoded[col].map(mapping).fillna(-1)
                else:
                    # Create label encoding
                    unique_vals = df_encoded[col].unique()
                    mapping = {val: idx for idx, val in enumerate(unique_vals)}
                    df_encoded[f'{col}_encoded'] = df_encoded[col].map(mapping).fillna(-1)

            elif method == 'onehot':
                # One-hot encoding
                dummies = pd.get_dummies(df_encoded[col], prefix=col, drop_first=True)
                df_encoded = pd.concat([df_encoded, dummies], axis=1)

        logger.info(f"Encoded categorical columns: {columns} using {method} encoding")
        return df_encoded

    def create_time_features(self, df: pd.DataFrame, date_column: str) -> pd.DataFrame:
        """
        Create time-based features from date column

        Args:
            df: Input DataFrame
            date_column: Name of the date column

        Returns:
            DataFrame with additional time features
        """
        df_time = df.copy()

        if date_column in df_time.columns:
            # Ensure datetime format
            df_time[date_column] = pd.to_datetime(df_time[date_column])

            # Extract time features
            df_time[f'{date_column}_year'] = df_time[date_column].dt.year
            df_time[f'{date_column}_month'] = df_time[date_column].dt.month
            df_time[f'{date_column}_day'] = df_time[date_column].dt.day
            df_time[f'{date_column}_hour'] = df_time[date_column].dt.hour
            df_time[f'{date_column}_dayofweek'] = df_time[date_column].dt.dayofweek
            df_time[f'{date_column}_quarter'] = df_time[date_column].dt.quarter
            df_time[f'{date_column}_is_weekend'] = df_time[date_column].dt.dayofweek.isin([5, 6]).astype(int)

        logger.info(f"Created time features for column: {date_column}")
        return df_time

    def calculate_customer_metrics(self, orders_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate customer behavior metrics

        Args:
            orders_df: DataFrame with order data

        Returns:
            DataFrame with customer metrics
        """
        # Group by customer
        customer_metrics = orders_df.groupby('customer_id').agg({
            'order_id': 'count',
            'total_amount': ['sum', 'mean', 'max'],
            'created_at': ['min', 'max']
        }).reset_index()

        # Flatten column names
        customer_metrics.columns = ['customer_id', 'total_orders', 'total_spent',
                                  'avg_order_value', 'max_order_value',
                                  'first_order_date', 'last_order_date']

        # Calculate additional metrics
        customer_metrics['customer_lifetime_days'] = (
            customer_metrics['last_order_date'] - customer_metrics['first_order_date']
        ).dt.days

        customer_metrics['avg_days_between_orders'] = (
            customer_metrics['customer_lifetime_days'] / customer_metrics['total_orders']
        )

        # Recency (days since last order)
        max_date = orders_df['created_at'].max()
        customer_metrics['recency_days'] = (
            max_date - customer_metrics['last_order_date']
        ).dt.days

        # Customer segments based on RFM-like scoring
        customer_metrics['customer_segment'] = pd.cut(
            customer_metrics['total_spent'],
            bins=[0, 100, 500, 1000, float('inf')],
            labels=['Low Value', 'Medium Value', 'High Value', 'VIP']
        )

        logger.info(f"Calculated metrics for {len(customer_metrics)} customers")
        return customer_metrics

    def calculate_product_metrics(self, orders_df: pd.DataFrame, products_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate product performance metrics

        Args:
            orders_df: DataFrame with order data
            products_df: DataFrame with product data

        Returns:
            DataFrame with product metrics
        """
        # Merge orders with products
        order_products = orders_df.merge(
            products_df[['product_id', 'category', 'price']],
            on='product_id',
            how='left'
        )

        # Group by product
        product_metrics = order_products.groupby('product_id').agg({
            'quantity': 'sum',
            'total_price': 'sum',
            'order_id': 'nunique'
        }).reset_index()

        product_metrics.columns = ['product_id', 'total_quantity_sold',
                                 'total_revenue', 'total_orders']

        # Calculate additional metrics
        product_metrics['avg_quantity_per_order'] = (
            product_metrics['total_quantity_sold'] / product_metrics['total_orders']
        )

        # Merge with product info
        product_metrics = product_metrics.merge(
            products_df[['product_id', 'name', 'category', 'price']],
            on='product_id',
            how='left'
        )

        # Calculate profit margin (assuming 30% margin)
        product_metrics['estimated_profit'] = product_metrics['total_revenue'] * 0.3

        logger.info(f"Calculated metrics for {len(product_metrics)} products")
        return product_metrics

    def detect_outliers(self, df: pd.DataFrame, columns: List[str],
                       method: str = 'iqr', threshold: float = 1.5) -> pd.DataFrame:
        """
        Detect outliers using IQR or Z-score method

        Args:
            df: Input DataFrame
            columns: Columns to check for outliers
            method: Detection method ('iqr' or 'zscore')
            threshold: Threshold for outlier detection

        Returns:
            DataFrame with outlier flags
        """
        df_outliers = df.copy()

        for col in columns:
            if col not in df_outliers.columns:
                continue

            if method == 'iqr':
                Q1 = df_outliers[col].quantile(0.25)
                Q3 = df_outliers[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - threshold * IQR
                upper_bound = Q3 + threshold * IQR

                df_outliers[f'{col}_is_outlier'] = (
                    (df_outliers[col] < lower_bound) | (df_outliers[col] > upper_bound)
                ).astype(int)

            elif method == 'zscore':
                z_scores = np.abs((df_outliers[col] - df_outliers[col].mean()) / df_outliers[col].std())
                df_outliers[f'{col}_is_outlier'] = (z_scores > threshold).astype(int)

        logger.info(f"Detected outliers in columns: {columns} using {method} method")
        return df_outliers

    def transform_orders_data(self, orders_df: pd.DataFrame) -> pd.DataFrame:
        """
        Complete transformation pipeline for orders data

        Args:
            orders_df: Raw orders DataFrame

        Returns:
            Transformed orders DataFrame
        """
        # Handle missing values
        orders_df = self.handle_missing_values(orders_df, {
            'total_amount': 'zero',
            'status': 'unknown',
            'customer_name': 'unknown'
        })

        # Clean text data
        orders_df = self.clean_text_data(orders_df, ['customer_name', 'customer_email'])

        # Create time features
        orders_df = self.create_time_features(orders_df, 'created_at')

        # Encode categorical data
        orders_df = self.encode_categorical_data(orders_df, ['status'], 'label')

        # Normalize numeric data
        orders_df = self.normalize_numeric_data(orders_df, ['total_amount', 'item_count'])

        # Detect outliers
        orders_df = self.detect_outliers(orders_df, ['total_amount'], 'iqr')

        logger.info("Completed orders data transformation")
        return orders_df

    def transform_products_data(self, products_df: pd.DataFrame) -> pd.DataFrame:
        """
        Complete transformation pipeline for products data

        Args:
            products_df: Raw products DataFrame

        Returns:
            Transformed products DataFrame
        """
        # Handle missing values
        products_df = self.handle_missing_values(products_df, {
            'price': 'zero',
            'stock_quantity': 'zero',
            'avg_rating': 'zero',
            'review_count': 'zero'
        })

        # Clean text data
        products_df = self.clean_text_data(products_df, ['name', 'category'])

        # Create time features
        products_df = self.create_time_features(products_df, 'created_at')

        # Encode categorical data
        products_df = self.encode_categorical_data(products_df, ['category'], 'label')

        # Normalize numeric data
        products_df = self.normalize_numeric_data(products_df,
                                                ['price', 'total_sold', 'total_revenue'])

        logger.info("Completed products data transformation")
        return products_df

if __name__ == "__main__":
    transformer = DataTransformer()

    # Example usage with sample data
    sample_orders = pd.DataFrame({
        'order_id': [1, 2, 3],
        'customer_id': [1, 2, 1],
        'total_amount': [129.99, 299.99, 89.99],
        'status': ['completed', 'pending', 'completed'],
        'created_at': pd.date_range('2024-01-01', periods=3),
        'customer_name': ['John Doe', 'Jane Smith', 'John Doe'],
        'customer_email': ['john@example.com', 'jane@example.com', 'john@example.com'],
        'item_count': [1, 1, 1]
    })

    transformed_orders = transformer.transform_orders_data(sample_orders)
    print(f"Transformed orders shape: {transformed_orders.shape}")
    print(transformed_orders.head())