import os
import pandas as pd

full_file_name = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), 'global-energy-substitution.csv'
    )

df = pd.read_csv(full_file_name)

# print(df.head())

# Simplifying column names
df.columns = df.columns.str.replace(' (TWh, substituted energy)', '')
# print(df.columns)

# Reducing the scope of the data frame
df = df[df['Year'] >= 1970]

df['Fossil'] = round(df['Gas'] + df['Oil'] + df['Coal'], 0).astype('int32')
df['Renewables'] = round(df['Other renewables'] + df['Biofuels'] + df['Solar'] + df['Wind'] + df['Hydropower'], 0).astype('int32')

# df = df[['Year', 'Fossil', 'Renewables']]

# print(df.to_json(orient='records', lines=True))
print('YEARS')
print(df['Year'].to_numpy())
print()
print('FOSSIL')
print(df['Fossil'].to_numpy())
print()
print('RENEWABLES')
print(df['Renewables'].to_numpy())
print()

print('MAX FOSSIL:', df['Fossil'].max())
print('MAX RENEWABLES:', df['Renewables'].max())


full_file_name = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), 'energy-consumption-by-source-and-country.csv'
    )

df = pd.read_csv(full_file_name)
df = df[df['Year'].isin([2017, 2022])]

removedContinents = ['Africa', 'Africa (EI)', 'Asia', 'Asia Pacific (EI)', 'Western Africa (EI)', 'World', 'Non-OECD (EI)', 'Upper-middle-income countries',
                     'OECD (EI)', 'High-income countries', 'Europe (EI)', 'North America', 'North America (EI)', 'Europe', 'Lower-middle-income countries',
                     'European Union (27)', 'South and Central America (EI)', 'South America', 'Oceania', 'Middle East (EI)', 'Middle Africa (EI)',
                     'CIS (EI)']
df = df[~df['Entity'].isin(removedContinents)]

df.columns = df.columns.str.replace(' (including geothermal and biomass) - TWh', '')
df.columns = df.columns.str.replace(' consumption - TWh', '')

df = df.fillna(0)

df['Fossil'] = round(df['Gas'] + df['Oil'] + df['Coal'], 0).astype('int32')
df['Renewables'] = round(df['Other renewables'] + df['Biofuels'] + df['Solar'] + df['Wind'] + df['Hydro'], 0).astype('int32')

df = df[['Entity', 'Year', 'Fossil', 'Renewables']]

df = df.pivot(index = 'Entity', columns = 'Year')

df['fossil_change'] = (df[('Fossil', 2022)] - df[('Fossil', 2017)]) / df[('Fossil', 2017)] * 100
df['renewables_change'] = (df[('Renewables', 2022)] - df[('Renewables', 2017)]) / df[('Renewables', 2017)] * 100

print(df[df[('Renewables', 2022)] >= df[('Renewables', 2022)].max() * 0.01].sort_values(by = 'renewables_change', ascending = False).head(10))
print(df[df[('Renewables', 2022)] >= df[('Renewables', 2022)].max() * 0.01].sort_values(by = ('Renewables', 2022), ascending = False).head(10))

# https://www.climatecouncil.org.au/11-countries-leading-the-charge-on-renewable-energy/