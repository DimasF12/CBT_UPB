<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="row">
				<div class="col-md-8">
					<div class="card card-custom">
						<div class="card-header flex-wrap border-0 pt-6 pb-0">
							<h3 class="card-title align-items-start flex-column">
								<span class="card-label font-weight-bolder text-dark">Live Class</span>
								<span class="text-muted mt-1 font-weight-bold font-size-sm">17 Agustus 2020</span>
							</h3>
						</div>
						<div class="card-body">
							<LiveFrame />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import LiveFrame from '@/components/classroom/LiveFrame'

export default {
	name: 'ClassroomLive',
	components: {
		LiveFrame
	}
}
</script>