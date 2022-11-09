import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './components/login/login-page';
import LandingPage from './components/landing-page/landing-page';
import MeuCadastro from './components/meu-cadastro/meu-cadastro';
import Usuarios from './components/usuarios/usuarios';
import Pessoas from './components/pessoas/pessoas';

function Router() {
	return (
		<Router>
			<Switch>
				<Route
					path="/home"
					component={LandingPage}
				/>
				<Route
					exact
					path="/"
					component={Login}
				/>
				<Route
					exact
					path="/meu-cadastro"
					component={MeuCadastro}
				/>
				<Route
					exact
					path="/usuarios"
					component={Usuarios}
				/>
				<Route
					exact
					path="/pessoas"
					component={Pessoas}
				/>
			</Switch>
		</Router>
	);
}

export default Router;
