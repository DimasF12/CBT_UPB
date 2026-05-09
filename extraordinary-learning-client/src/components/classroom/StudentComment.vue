<template>
	<div>
		<VuePerfectScrollbar
			style="max-height: 50vh; position: relative;"
		>
		  <div class="timeline timeline-justified timeline-4">
    <div class="timeline-bar"></div>
    <div class="timeline-items">
        <div class="timeline-item" v-for="comment in comments" :key="comment.id">
            <div class="timeline-badge">
                <div class="bg-success"></div>
            </div>

            <div class="timeline-label">
                <span class="text-primary font-weight-bold">{{ comment.user.name }}
									<i class="flaticon2-correct text-primary small" v-if="comment.user.role == '1'"></i>
							<i class="flaticon-safe-shield-protection text-primary small" v-if="comment.user.role == '0'"></i>
								</span>
            </div>

            <div class="timeline-content  max-w-400px">
                	{{ comment.content }}
            </div>
        </div>
    </div>
</div>
		</VuePerfectScrollbar>
		<div class="separator separator-solid mt-5 mb-4"></div>								
		<form class="position-relative"  @submit.prevent="submit()">
			<input id="kt_forms_widget_5_input" 
			class="form-control border-0 p-0 pr-10 resize-none" 
			rows="1" 
			placeholder="Reply..." 
			v-model="content"
			style="overflow: hidden; overflow-wrap: break-word; height: 19px;"
			/>

			<div class="position-absolute top-0 right-0 mt-n1 mr-n2">
				<span class="btn btn-icon btn-sm btn-hover-icon-primary" @click="submit">
					<i class="flaticon2-send-1 icon-ms"></i>
				</span>
			</div>
		</form>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'CommentLecture',
	components: {
		VuePerfectScrollbar
	},
	data() {
		return {
			content: '',
			channel:''
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user',['authenticated']),
		...mapState('classroom',['comments']),
		...mapState('channel',['socket'])
	},
	methods: {
		...mapActions('classroom',['getDataComments', 'createNewComment']),
		async submit() {
			try {
				let provider = this.createNewComment({
					classroom_live_id: this.$route.params.id,
					content: this.content
				})
				this.socket.emit('comment', {
					comment: {
						content: this.content,
						user: this.authenticated
					}
				})
				this.content = ''
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		scrollToEnd() {
			setTimeout(() => {
				const container = this.$el.querySelector('.ps-container');
				container.scrollTop = container.scrollHeight;
			}, 0);
		}
	},
	async created() {
		try {
			this.channel = 'classlive_'+this.$route.params.id
			await this.getDataComments(this.$route.params.id)
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	mounted() {
		this.socket.on('comment', (comment) => {
			this.comments.push(comment)
			this.scrollToEnd()
		})
	},
}
</script>