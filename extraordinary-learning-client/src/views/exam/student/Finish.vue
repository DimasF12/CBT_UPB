<template>
	<div class="container mt--5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card card-custom shadow-none border">
                    <div class="card-header flex-wrap border-0 pt-6 pb-0">
						<h3 class="card-title align-items-start flex-column">
							<span class="card-label font-weight-bolder text-dark">Ulangan selesai</span>
							<span class="text-muted mt-1 font-weight-bold font-size-sm">Anda telah selesai mengerjakan ulangan ini</span>
						</h3>
					</div>
                    <div class="card-body">
						<router-link class="btn btn-primary btn-block" :to="{ name: 'home' }">Dashboard</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>