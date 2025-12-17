import { BrowserRouter, Routes, Route } from 'react-router'
import { ListPasswordsPage } from './pages/ListPasswordsPage'
import { MainPage } from './pages/MainPage'
import { DonatePage } from './pages/DonatePage'
import { RootLayout } from './pages/RootLayout'

export default () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<RootLayout />}>
					<Route path='/' element={<MainPage />} />
					<Route path='/list' element={<ListPasswordsPage />} />
					<Route path='/donate' element={<DonatePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
