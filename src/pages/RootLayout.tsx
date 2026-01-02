import { Outlet, Link } from 'react-router'

export const RootLayout = () => {
  return (
    <>
      <header>
        <nav className='navbar navbar-expand-sm bg-body-tertiary'>
          <div className='container-fluid'>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarNav'
              aria-controls='navbarNav'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='navbarNav'>
              <ul className='navbar-nav d-flex gap-1'>
                <li className='nav-item'>
                  <Link
                    className='nav-link d-flex align-items-center gap-1'
                    to='/'
                  >
                    <i className='bi bi-house'></i>
                    Главная
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link d-flex align-items-center gap-1'
                    to='/list'
                  >
                    <i className='bi bi-list'></i>
                    Список паролей
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link d-flex align-items-center gap-1'
                    to='/donate'
                  >
                    <i className='bi bi-heart'></i>
                    Поддержать автора
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className='container' style={{ minHeight: '100vh' }}>
        <Outlet />
      </main>
      <footer style={{ backgroundColor: '#f3f3f3' }} className='mt-5 p-3'>
        <p className='text-center mb-3 font-bold'>Cсылки автора:</p>
        <div className=' d-flex justify-content-center align-items-center gap-3'>
          <Link
            to='https://yuriyprogg.vercel.app'
            className='link-dark'
            target='_blank'
          >
            Сайт
          </Link>
          <Link
            to='https://github.com/yuriyProgg'
            className='link-dark'
            target='_blank'
          >
            GitHub
          </Link>
          <Link
            to='https://vk.ru/yuri_masalov'
            className='link-primary'
            target='_blank'
          >
            ВКонтакте
          </Link>
          <Link
            to='https://t.me/yuriyProgg_channel'
            className='link-info'
            target='_blank'
          >
            Telegram Канал
          </Link>
        </div>
      </footer>
    </>
  )
}
