import './App.css';
import LoginPage from './components/login/login-page';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/landing-page/landing-page';
import MeuCadastro from './components/meu-cadastro/meu-cadastro';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Usuarios from './components/usuarios/usuarios';
import Pessoas from './components/pessoas/pessoas';
import Contatos from './components/contatos/contatos';

function App() {
	const theme = createTheme({
		palette: {
			primary: { main: '#CF2E2E' },
		},
	});

	return (
		<>
			<ThemeProvider theme={theme}>
				<div className="App">
					<Routes>
						<Route
							path="/"
							element={<LoginPage />}
						/>

						<>
							<Route
								path="/home"
								element={<LandingPage />}
							/>

							<Route
								path="/meu-cadastro"
								element={<MeuCadastro />}
							/>
							<Route
								path="/usuarios"
								element={<Usuarios />}
							/>
							<Route
								path="/pessoas"
								element={<Pessoas />}
							/>
							<Route
								path="/contatos"
								element={<Contatos />}
							/>
						</>
					</Routes>
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
