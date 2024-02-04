# %%

# Script for extracting, converting, and saving results from the 2024 USA Marathon Olympic Trials

# %%
import requests
import json
import os
import pandas as pd
import numpy as np

# %%

# Function for converting API response to a table
# Takes the raw response as input
# Assumes that the data is in the `list` item 

def extract_results_table(_txt):
    
    _json = json.loads(_txt)
    _df = pd.DataFrame(_json['list'])

    return _df

# %%
payload = {
    'timesort': '1',
    'nohide': '1',
    'checksum': '', 
    'appid': '65328519e78ff0366f242153',
    'token': '0CB822ADFDC6C77C4394', # Just some token that works
    'max': '999',
    'catloc': '1',
    'cattotal': '1',
    'units': 'standard',
    'source': 'webtracker'
}


# %%
# Build list of URLs

url_list = []    

url_base = 'https://api.rtrt.me/events/ORLANDO-TRIALS-2024/categories/top-{}-marathon/splits/{}M'

for g in ['men', 'women']:
    for i in range(1,27):
        url = url_base.format(g, i)
        url_list.append(url)

    url_list.append('https://api.rtrt.me/events/ORLANDO-TRIALS-2024/categories/top-{}-marathon/splits/FINISH'.format(g))

# Go get results!
    
list_results = []

for url in url_list:
    print(url)
    response = requests.post(url, data=payload)
    response_text = response.text
    response_code = response.status_code

    if response_code == 200:
        df_split_result = extract_results_table(response_text)
        list_results.append(df_split_result)

    else:

        print(response_code)
        print(response_text)  # Prints the response body

df_results = pd.concat(list_results, axis=0)

# %%
# Do some conversions

# Convert 'FINISH' to 26.2
df_results['point'] = np.where(df_results['point']=='FINISH', '26.2M', df_results['point'])

# Convert distance strings to floats
df_results['distance'] = df_results['point'].str.slice(0, -1).astype(np.float64)

# %%
# Save the raw results by mile:

df_results[df_results['sex']=='M'].to_csv(os.path.join('..', 'usa-marathon-trials-2024', 'data', 'result_mens_by_mile.csv'))
df_results[df_results['sex']=='F'].to_csv(os.path.join('..', 'usa-marathon-trials-2024', 'data', 'result_womens_by_mile.csv'))

