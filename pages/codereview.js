import Layout from "../components/layout";

export default function CodeReview() {
    return (
        <Layout>
            <div className="relative mx-auto">
                <div>
                    Choose a project to review:
                </div>

                <div>
                    Choose Repository:
                </div>

                <div id="code-review-details" className="p-10">
                    <ul>
                        <li>The project starter code will be checked out into a new repository</li>
                        <li>A pull request will be created containing your changes from teh selected repository</li>
                        <li>Your mentor will be notified of your request for code review</li>
                    </ul>
                </div>

                <div className="flex justify-center">
                    <div className="inline-flex justify-center rounded-md px-4 py-2 bg-indigo-600">Request Code Review</div>
                </div>
            </div>
        </Layout>
    )
}