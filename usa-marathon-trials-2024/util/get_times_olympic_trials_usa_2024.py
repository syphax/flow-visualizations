# %%
# Script for extracting, converting, and saving results from the 2024 USA Marathon Olympic Trials

# %%
import requests
import json
import os

import pandas as pd
import numpy as np

from scipy.interpolate import interp1d


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
    'token': '0CB822ADFDC6C77C4394',
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

df_results['point'] = np.where(df_results['point']=='FINISH', '26.2M', df_results['point'])

df_results['distance'] = df_results['point'].str.slice(0, -1).astype(np.float64)

df_results['time_sec'] = pd.to_timedelta(df_results['time']).dt.total_seconds()
df_results['time_min'] = df_results['time_sec'] / 60.0

# %%
# Save the raw results by mile:

df_results[df_results['sex']=='M'].to_csv(os.path.join('..', 'public', 'data', 'result_men_by_mile.csv'), index=False)
df_results[df_results['sex']=='F'].to_csv(os.path.join('..', 'public', 'data', 'result_women_by_mile.csv'), index=False)

# %%
# Interpolate distances for fixed time intervals

# %%
def find_interpolated_distances(_df, new_x, fld_x='time_min', fld_y='distance'):
    '''
        _df: Dataframe of actual values; must contain the fields specified by: 
        fld_x: Name of field with x values
        fld_y: Name of field with y values
        new_x: List of new x values
    '''

    # We need to deal with non-finishers:
    max_len = len(_df)
    new_x_trimmed = new_x[:max_len]

    f = interp1d(_df[fld_x], _df[fld_y], kind='linear', bounds_error=False, fill_value="extrapolate")
    _estimated_distances = f(new_x_trimmed)
    
    # Let's make sure we cap things at the finish
    _estimated_distances = np.where(_estimated_distances > 26.2, 26.2, _estimated_distances)

    return _estimated_distances

# %%
def make_interpolated_results_table(_df, runner_name, time_values):
    '''
        _df: Table with fields including 'name', 'distance', 'time_min'
        runner_name: Name of runner that appears in the 'name' field
        time_values: List of time values for which we interpolate distance
    '''

    _df_sample = _df[_df['name'] == runner_name].copy().reset_index()

    # This is not elegant; it adds zero values so we have complete data from 0 to 26.2:
    _df_sample.loc[len(_df_sample)] = {'name': runner_name, 'distance': 0.0, 'time_min': 0.0}

    _distances = find_interpolated_distances(_df_sample, time_values, 'time_min', 'distance')

    # Make new df with results; trim the times for non-finishers

    _df_new = pd.DataFrame({'time_min': time_values[:len(_distances)], 'distance': _distances})
    _df_new['name'] = runner_name

    return _df_new

    

# %%
# Get list of runners

df_runners = df_results.groupby(['name', 'sex'], as_index=False).agg({'distance':'nunique', 'time_min':'max'})

# %%
# Loop through and estimate distances for specific time splits

times = np.arange(0, 181, 5.0).tolist()

list_df_distances = []

for i, r in df_runners.iterrows():
    print(r['name'], r['distance'])
    df_dist_tmp = make_interpolated_results_table(df_results, r['name'], times)
    df_dist_tmp['gender'] = r['sex']
    list_df_distances.append(df_dist_tmp)

df_distances = pd.concat(list_df_distances, axis=0)



# %%
# Save the raw results by mile:

df_distances[df_distances['gender']=='M'].to_csv(os.path.join('..', 'public', 'data', 'result_men_by_5min.csv'), index=False)
df_distances[df_distances['gender']=='F'].to_csv(os.path.join('..', 'public', 'data', 'result_women_by_5min.csv'), index=False)


# %%



