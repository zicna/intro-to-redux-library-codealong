export default function counterReducer(
	state = {
		clicks: 0
	},
	action
) {
	switch (action.type) {
		case 'INCREASE_COUNT':
			return {
				clicks: state.clicks + 1
			}
		default:
			return state;
	}
}
