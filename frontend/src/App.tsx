import { Bounce, ToastContainer } from 'react-toastify'
import { renderRoutes } from './navigation/router'
import { Routes } from 'react-router-dom'
import { ConfigProvider, theme as antTheme } from 'antd' 
import { useTheme } from '@app/hook/useTheme' 

function App() {
  const { theme } = useTheme()
  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
           fontFamily: 'Open Sans, sans-serif',
           colorBgBase: 'var(--bg-body)',
           colorTextBase: 'var(--text-primary)',
           colorBgContainer: 'var(--bg-container)',
           colorText: 'var(--text-primary)',
           colorTextSecondary: 'var(--text-secondary)',
           colorBorder: 'var(--border-color)'
        }
      }}
    >
      <div className={`app-container ${theme}`}>
      <Routes>{renderRoutes()}</Routes>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
        transition={Bounce}
      />
      </div>
    </ConfigProvider>
  )
}

export default App
