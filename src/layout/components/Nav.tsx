import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import useDid from '../../hooks/useHasDid'
import { IRoute } from '../../router/index'

const Nav = (props: any) => {
  const menu = props.state.menu.curMenu
  const history = useHistory()
  const curUrl = history.location.pathname
  const [curPath, SetCurPath] = useState('')
  const hasDid = useDid()

  useEffect(() => {
    console.log('更新了curUrl=====>', curUrl)
    SetCurPath(curUrl === '/' ? '/overview' : curUrl)
  }, [])
  console.log('curPath', curPath)

  const linkTo = (item: IRoute, e: React.MouseEvent<any, MouseEvent>) => {
    e.stopPropagation()
    if (item.children) return
    if (!hasDid) {
      SetCurPath('/didApplication')
      history.push('/didApplication')
      return
    }
    SetCurPath(item.path)
    history.push(item.path)
  }
  const { t } = useTranslation()
  const mouseEnter = (item: IRoute, e: React.MouseEvent<any, MouseEvent>) => {
    e.stopPropagation()
    if (item.children) {
      props.setMenu(item.name)
    }
  }
  const mouseLeave = (e: React.MouseEvent<any, MouseEvent>) => {
    e.stopPropagation()
    props.setMenu('')
  }

  return (
    <div className="nav-box">
      {props.list.map((item: IRoute) =>
        item.meta.show ? (
          <div className="sub-nav-box pointer" onMouseEnter={(e) => mouseEnter(item, e)}
            onMouseLeave={(e) => mouseLeave(e)}>
            <div
              className={`sub-nav ${curPath.includes(item.path) ? 'activeMenu' : null}`}
              key={item.name}
              onClick={e => linkTo(item, e)}
            >
              {t(`${item.label}`)}
              {item.children && item.name === menu ? (
                <div className="child-box">
                  <ul className="child-nav">
                    {item.children.map(child =>
                      child.meta.show ? (
                        <li key={child.name} onClick={e => linkTo(child, e)}>
                          {t(`${child.label}`)}
                        </li>
                      ) : (
                        ''
                      ),
                    )}
                  </ul>
                </div>

              ) : (
                ''
              )}
            </div>
          </div>

        ) : (
          ''
        ),
      )}
    </div>
  )
}

export default connect(
  (state: any) => ({ state }),
  (dispatch: any) => ({
    setMenu: (menu: string) => {
      dispatch({
        type: 'SETMENU',
        data: menu,
      })
    },
  }),
)(Nav)
