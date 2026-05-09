export default {
	methods: {
		$role(namerole) {
			let role = this.$store.state.user.authenticated.role
			if(role) {
				if(role == namerole) {
					return true;
				}
			}
			return false;
		}
	}
}