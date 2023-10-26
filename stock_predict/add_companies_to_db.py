from stock_predict import models

def add_company():
    models.Company.objects.all().delete() #

    companies = {
        "1101": "台　泥(1101)",
        "1216": "統　一(1216)",
        "1301": "台　塑(1301)",
        "1303": "南　亞(1303)",
        "1326": "台　化(1326)",
        "1590": "亞德客-KY(1590)",
        "2002": "中　鋼(2002)",
        "2207": "和泰車(2207)",
        "2301": "光寶科(2301)",
        "2303": "聯　電(2303)"
        }

    # for code,name in companies.items():
    #     company = models.Company()
    #     company.stock_code = code
    #     company.name = name
    #     company.save()

    for new_index, (code, name) in enumerate(companies.items(), start=1):
        company = models.Company()
        company.id = new_index  # 设置新的索引
        company.stock_code = code
        company.name = name
        company.save()

