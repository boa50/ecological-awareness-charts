import os
import pandas as pd

full_file_name = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), 'global-energy-substitution.csv'
    )

df = pd.read_csv(full_file_name)

# print(df.head())

# Simplifying column names
df.columns = df.columns.str.replace(' (TWh, substituted energy)', '')
print(df.columns)

# Reducing the scope of the data frame
df = df[df['Year'] >= 1970]

df['Fossil'] = round(df['Gas'] + df['Oil'] + df['Coal'], 0).astype('int32')
df['Renewables'] = round(df['Other renewables'] + df['Biofuels'] + df['Solar'] + df['Wind'] + df['Hydropower'], 0).astype('int32')

# df = df[['Year', 'Fossil', 'Renewables']]

# print(df.to_json(orient='records', lines=True))
print(df['Year'].to_numpy())
print(df['Fossil'].to_numpy())
print(df['Renewables'].to_numpy())

print(df['Fossil'].max())
print(df['Renewables'].max())