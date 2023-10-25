# 获取国内股票历史数据
import json
import os
import requests
import pandas as pd
from datetime import datetime,timedelta

def get_domestic_stock(sticker_code):
    # # 从网易接口获取数据
    # api_adr = 'http://quotes.money.163.com/service/chddata.html'
    # fields = "TOPEN;TCLOSE;HIGH;LOW;VOTURNOVER"
    # # 注意：获取上海证券与深圳证券股票的数据，需要构造不同的URL
    # tag = "0"       # 上海证券
    # if sticker_code in ['000063','000066','000768','000651']:
    #     tag = "1"   # 深圳证券

    # params = {'code': tag + sticker_code, 'start': start_date, 'end': end_date, 'fields': fields}
    # r = requests.get(api_adr, params=params)

    # print(r.url)
    # txt_list = r.text.split('\n')   # r.content二进制数据    r.text 文本数据
    # txt_list.reverse()
    # txt_list[0] = txt_list[-1]  # 列名替换开头的空字符
    # col_name = "Date,Code,Name,Open,Close,High,Low,Volume\n"
    # txt_list[0] = col_name
    # txt_list.pop(-1)
    current_date = datetime.now()
    first_day_of_current_month = current_date.replace(day=1)

    last_month = current_date - timedelta(days=current_date.day)
    first_day_of_last_month = last_month.replace(day=1)

    current_month_date = first_day_of_current_month.strftime("%Y%m%d")
    last_month_date = first_day_of_last_month.strftime("%Y%m%d")

    html = requests.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=%s&stockNo=%s' % (last_month_date, sticker_code))
    content = json.loads(html.text)
    Name = content['title']
    stock_data = content['data']
    col_name = content['fields']
    last_month_df = pd.DataFrame(data=stock_data, columns=col_name)
    last_month_df = last_month_df.rename(columns={
        "日期": "Date",
        "成交股數": "Volume",
        "成交金額": "Turnover",
        "開盤價": "Open",
        "最高價": "High",
        "最低價": "Low",
        "收盤價": "Close",
        "漲跌價差": "Price Change",
        "成交筆數": "Transactions"
    })
    last_month_df["Name"] = "元大台灣50"
    last_month_df["Code"] = "0050"
    last_month_df = last_month_df[["Date", "Code", "Name", "Open", "Close", "High", "Low", "Volume"]]

    html = requests.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=%s&stockNo=%s' % (current_month_date, sticker_code))
    content = json.loads(html.text)
    Name = content['title']
    stock_data = content['data']
    col_name = content['fields']
    current_month_df = pd.DataFrame(data=stock_data, columns=col_name)
    current_month_df = current_month_df.rename(columns={
        "日期": "Date",
        "成交股數": "Volume",
        "成交金額": "Turnover",
        "開盤價": "Open",
        "最高價": "High",
        "最低價": "Low",
        "收盤價": "Close",
        "漲跌價差": "Price Change",
        "成交筆數": "Transactions"
    })
    current_month_df["Name"] = "元大台灣50"
    current_month_df["Code"] = "0050"
    current_month_df = current_month_df[["Date", "Code", "Name", "Open", "Close", "High", "Low", "Volume"]]

    current_month_AND_last_month_df = pd.concat([current_month_df, last_month_df])
    #轉換Date格式。原本的為112/10/02轉成20231002
    def convert_date(date_str):
        parts = date_str.split('/')
        year = str(int(parts[0]) + 1911)
        formatted_date = year + '-' + parts[1] + '-' + parts[2]
        return formatted_date
    def convert_code(code_int):
        formated_code = "'"+str(code_int)
        return formated_code
    def convert_volume(volume_str):
        formated_volume = int(volume_str.replace(",", ""))
        return formated_volume
    current_month_AND_last_month_df['Date'] = current_month_AND_last_month_df['Date'].apply(convert_date)
    current_month_AND_last_month_df['Code'] = current_month_AND_last_month_df['Code'].apply(convert_code)
    current_month_AND_last_month_df['Volume'] = current_month_AND_last_month_df['Volume'].apply(convert_volume)
    
    root = os.path.dirname(os.path.dirname(__file__))
    dir_path = os.path.join(root,"data")
    filename = sticker_code + ".csv"
    # print(os.path.join(dir_path,filename))
    file_path = root+"/data/"+filename
    current_month_AND_last_month_df.to_csv(file_path, index = False)
    # with open(os.path.join(dir_path,filename), "w+", encoding='utf-8') as f:
    #     for line in txt_list:
    #         if line.split(',')[3] != '0.0':     # 去除无效数据
    #             f.write(line)


def get_all_last_data(start_date): # 得到从start_date至今日 所有最新数据
    root = os.path.dirname(os.path.dirname(__file__))
    config_path = os.path.join(root,"config.json")

    configs = json.load(open(config_path, 'r'))
    companies = configs['companies']

    # start_date = '2010-06-21'  # 只能按整年获取至今日数据
    cur = datetime.now()
    year = timedelta(days=365)
    cur = cur + year    # 在当前日期上加一年
    end_date = cur.strftime("%Y-%m-%d")  # 获取今年最新数据

    for code, company_name in companies.items():
        get_domestic_stock(code)

def get_single_last_data(stock_code,start_date="2010-01-01"):
    # start_date = '2010-06-21'  # 只能按整年获取至今日数据
    cur = datetime.now()
    year = timedelta(days=365)
    cur = cur + year  # 在当前日期上加一年
    end_date = cur.strftime("%Y-%m-%d")  # 获取今年最新数据

    get_domestic_stock(stock_code)


if __name__ == '__main__':
    get_all_last_data("2010-01-01")
