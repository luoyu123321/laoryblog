import React, { useEffect, useState, ReactElement } from 'react';
import { Button, Flex, Input, message, Table, ConfigProvider } from 'antd';
import axios from 'axios';
import moment from 'moment';

interface queryCounterProps {

}

/**
 * 记录查询模块
 */
const QueryCounter: React.FC<queryCounterProps> = ({ }): ReactElement => {

  const [groupName, setGroupName] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [selectKey, setSelectKey] = useState<number>(0);
  const [selectTitleKey, setSelectTitleKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)
  const [allDataLoading, setAllDataLoading] = useState<boolean>(false)
  const [titleDataLoading, setTitleDataLoading] = useState<boolean>(false)
  const [typeDataLoading, setTypeDataLoading] = useState<boolean>(false)
  const [allTableData, setAllTableData] = useState<any[]>([])
  const [titleTableData, setTitleTableData] = useState<any[]>([])
  const [typeTableData, setTypeTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<any[]>([{ title: '标题', dataIndex: 'title', align: 'center', }])

  /**
   * 每当查询到集合数据后，默认查询第一条标题数据详情
   */
  useEffect(() => {
    if (allTableData.length > 0) {
      setSelectKey(0);
      const { groupName, title } = allTableData[0]
      groupName && title && search({ groupName, title });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTableData]);

  /**
   * 每当查询到标题数据后，默认查询第一条记录项详情
   */
  useEffect(() => {
    if (titleTableData.length > 0) {
      setSelectTitleKey(0);
      const { groupName, title, type } = titleTableData[0]
      groupName && title && type && search({ groupName, title, type });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleTableData]);

  const search = async ({ groupName, title = '', type = '', isSearch = false }) => {
    if (!groupName) {
      message.warning({ content: '集合名不能为空！', duration: 2, style: { marginTop: '10vh' }, })
    }
    const isSearchAll = groupName && !title && !type;
    const isSearchTitle = groupName && title && !type;
    const isSearchType = groupName && type;
    /* 如果是搜索时，先清空所有数据 */
    if (isSearch) {
      setAllTableData([]);
      setTitleTableData([]);
      setTypeTableData([]);
    }
    try {
      isSearchAll && setAllDataLoading(true)
      isSearchTitle && setTitleDataLoading(true)
      isSearchType && setTypeDataLoading(true)
      isSearch && setLoading(true);
      const res = await axios.post('/api/counterQuery', {
        opttyp: isSearchAll ? 'groupName' : 'query',
        groupName,
        title,
        type,
      })
      isSearchAll && setColumns(columnFormat(res.data.counter[0]?.typeList))
      isSearchAll && setAllTableData(allDataFormat(res.data.counter[0]?.counters))
      isSearchTitle && setTitleTableData(res.data.counter.map((item) => { return { ...item, createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') } }))
      isSearchType && setTypeTableData(res.data.counter.map((item) => { return { ...item, createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') } }))

    } catch (error) {
      console.log(error);
      message.error({ content: error, duration: 2, style: { marginTop: '10vh' }, })
    } finally {
      isSearchAll && setAllDataLoading(false)
      isSearchTitle && setTitleDataLoading(false)
      isSearchType && setTypeDataLoading(false)
      isSearch && setLoading(false);
    }
  }

  const allDataFormat = (formatData: any) => {
    let data = {}
    let resArr = []
    /* 首先将同一标题的数据整合 */
    formatData.map((item) => {
      if (!data[item.title]) {
        data[item.title] = []
      }
      data[item.title].push(item)
    })
    /* 再将每个标题下的数据每个计数项都取最新一条数据，格式化成每种计数项的key value格式 */
    for (const key in data) {
      let valueData = {};
      typeList.forEach((item) => {
        valueData[item] = data[key].filter(itm => itm.type === item)[0]?.accumulate || 0;
      })
      resArr.push({ title: key, ...valueData, createdAt: moment(data[key][0]?.createdAt).format('YYYY-MM-DD HH:mm:ss'), groupName: data[key][0]?.groupName })
    }
    return resArr
  }

  const columnFormat = (formatData: any) => {
    return [
      { title: '标题', dataIndex: 'title', align: 'center', },
      ...formatData.map(item => {
        return {
          title: item,
          dataIndex: item,
          align: 'center',
        }
      }),
      { title: '操作时间', dataIndex: 'createdAt', align: 'center', },
    ]
  }

  /* 搜索按钮 */
  const searchBtn = () => search({ groupName, title, type, isSearch: true });

  return (
    <>
      <div style={{ padding: '10px 5%' }}>
        <Flex gap={'small'} vertical align='center' style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Input value={groupName} onPressEnter={searchBtn} onChange={(e) => setGroupName(e.target.value)} maxLength={25} placeholder='在此输入集合名(必填)' />
          <div style={{ width: '100%' }}>
            <Input value={title} onPressEnter={searchBtn} onChange={(e) => setTitle(e.target.value)} style={{ width: '50%' }} maxLength={25} placeholder='在此输入标题' />
            <Input value={type} onPressEnter={searchBtn} onChange={(e) => setType(e.target.value)} style={{ width: '50%' }} maxLength={25} placeholder='在此输入记录项' />
          </div>
          <Button loading={loading} onClick={searchBtn} type="primary" style={{ width: '100%' }}>查询</Button>
        </Flex>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowHoverBg: '#1bcf0e',
              cellPaddingBlockSM: 3,
            },
          },
        }}
      >
        <span className='queryCounter-table-title'>集合数据总览</span>
        <Table loading={allDataLoading} columns={columns as any} dataSource={allTableData} size="small" pagination={{ pageSize: 5 }}
          rowClassName={(_, index) => {
            return index === selectKey ? 'queryCounter-table-selected' : null
          }}
          onRow={(record, index) => {
            const { groupName, title } = record;
            return {
              onClick: () => {
                setSelectKey(index);
                search({ groupName, title });
              }
            }
          }} />
        <span className='queryCounter-table-title'>当前标题数据</span>
        <Table loading={titleDataLoading} columns={titleColumns as any} dataSource={titleTableData} size="small" pagination={{ pageSize: 5 }}
          rowClassName={(_, index) => {
            return index === selectTitleKey ? 'queryCounter-table-selected' : null
          }}
          onRow={(record, index) => {
            const { groupName, title, type } = record;
            return {
              onClick: () => {
                setSelectTitleKey(index);
                search({ groupName, title, type });
              }
            }
          }} />
        <span className='queryCounter-table-title'>当前记录项数据</span>
        <Table loading={typeDataLoading} columns={titleColumns as any} dataSource={typeTableData} size="small" pagination={{ pageSize: 5 }} />
      </ConfigProvider>
    </>
  );
}

export default QueryCounter;

const titleColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    align: 'center',
  }, {
    title: '记录类型',
    dataIndex: 'type',
    align: 'center',
  }, {
    title: '记录值',
    dataIndex: 'accumulate',
    align: 'center',
  }, {
    title: '记录时间',
    dataIndex: 'createdAt',
    align: 'center',
  },
]

const typeColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    align: 'center',
  }, {
    title: '记录类型',
    dataIndex: 'type',
    align: 'center',
  }, {
    title: '记录值',
    dataIndex: 'accumulate',
    align: 'center',
  }, {
    title: '记录时间',
    dataIndex: 'createdAt',
    align: 'center',
  },
]

const testData = [
  {
    "id": "66548b8e68eddba7ec8b220a",
    "createdAt": "2024-05-27T13:33:00.435Z",
    "updatedAt": "2024-05-27T13:33:00.435Z",
    "groupName": "台球测试一",
    "title": "20240527",
    "type": "刘赢",
    "accumulate": 1
  },
  {
    "id": "66548b9568eddba7ec8b220c",
    "createdAt": "2024-05-27T13:33:07.404Z",
    "updatedAt": "2024-05-27T13:33:07.404Z",
    "groupName": "台球测试一",
    "title": "20240527",
    "type": "罗赢",
    "accumulate": 2
  },
  {
    "id": "66548b9968eddba7ec8b220e",
    "createdAt": "2024-05-27T13:33:11.719Z",
    "updatedAt": "2024-05-27T13:33:11.719Z",
    "groupName": "台球测试一",
    "title": "20240527",
    "type": "连进四球",
    "accumulate": 1
  },
  {
    "id": "66548b9d68eddba7ec8b2210",
    "createdAt": "2024-05-27T13:33:15.690Z",
    "updatedAt": "2024-05-27T13:33:15.690Z",
    "groupName": "台球测试一",
    "title": "20240527",
    "type": "连进四球",
    "accumulate": 2
  },
  {
    "id": "66548ff2b01c8ba579acc6c6",
    "createdAt": "2024-05-27T13:51:45.137Z",
    "updatedAt": "2024-05-27T13:51:45.137Z",
    "groupName": "台球测试一",
    "title": "20240527-2",
    "type": "连进四球",
    "accumulate": 1
  },
  {
    "id": "66548ff7b01c8ba579acc6c8",
    "createdAt": "2024-05-27T13:51:49.408Z",
    "updatedAt": "2024-05-27T13:51:49.408Z",
    "groupName": "台球测试一",
    "title": "20240527-2",
    "type": "连进三球",
    "accumulate": -1
  },
  {
    "id": "66548ffab01c8ba579acc6ca",
    "createdAt": "2024-05-27T13:51:52.871Z",
    "updatedAt": "2024-05-27T13:51:52.871Z",
    "groupName": "台球测试一",
    "title": "20240527-2",
    "type": "罗赢",
    "accumulate": 1
  },
  {
    "id": "665530640270526af2571236",
    "createdAt": "2024-05-28T01:16:19.015Z",
    "updatedAt": "2024-05-28T01:16:19.015Z",
    "groupName": "台球测试一",
    "title": "20240527",
    "type": "刘赢",
    "accumulate": 2
  },
  {
    "id": "6655371a0270526af257123f",
    "createdAt": "2024-05-28T01:44:57.610Z",
    "updatedAt": "2024-05-28T01:44:57.610Z",
    "groupName": "台球测试一",
    "title": "20240528",
    "type": "刘赢",
    "accumulate": 1
  },
  {
    "id": "6655373f0270526af2571242",
    "createdAt": "2024-05-28T01:45:33.984Z",
    "updatedAt": "2024-05-28T01:45:33.984Z",
    "groupName": "台球测试一",
    "title": "20240528",
    "type": "罗赢",
    "accumulate": 1
  },
  {
    "id": "665537640270526af2571245",
    "createdAt": "2024-05-28T01:46:11.407Z",
    "updatedAt": "2024-05-28T01:46:11.407Z",
    "groupName": "台球测试一",
    "title": "20240528",
    "type": "连进四球",
    "accumulate": 1
  },
  {
    "id": "665542600270526af2571260",
    "createdAt": "2024-05-28T02:33:03.651Z",
    "updatedAt": "2024-05-28T02:33:03.651Z",
    "groupName": "台球测试一",
    "title": "20240227",
    "type": "罗赢",
    "accumulate": 1
  },
  {
    "id": "6655428a0270526af2571264",
    "createdAt": "2024-05-28T02:33:44.766Z",
    "updatedAt": "2024-05-28T02:33:44.766Z",
    "groupName": "台球测试一",
    "title": "20240228",
    "type": "刘赢",
    "accumulate": 1
  },
  {
    "id": "6655467c0270526af257127b",
    "createdAt": "2024-05-28T02:50:35.112Z",
    "updatedAt": "2024-05-28T02:50:35.112Z",
    "groupName": "台球测试一",
    "title": "20240526",
    "type": "罗赢",
    "accumulate": 1
  }
]

const typeList = [
  "刘赢",
  "罗赢",
  "连进三球",
  "连进四球",
  "连进五球"
]