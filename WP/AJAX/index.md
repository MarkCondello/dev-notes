# Sending AJAX request in WP

Sending an Ajax request in WP requires the following requirements:
  - the `admin-ajax.php` file in the request
  - adding a nonce with the `wp_create_nonce()` function and
  - including an `action` name so we can use the action hook `add_action("wp_ajax_NAME_OF_THE_ACTION")`

## PHP implementation
We can use a form or an anchor tag with the required items above to send of a request to `admin-ajax.php`

*php form*
```
@php($nonce = wp_create_nonce("user_vote_nonce"))
<form method="POST" action="{{ admin_url('admin-ajax.php') }}">
  <input type="hidden" name="action" value="user_vote">
  <input type="hidden" name="nonce" value="{{ $nonce }}"> 
  <input type="hidden" name="post_id" value="{{ the_ID() }}"> 
  <button type="submit"
    data-nonce="{{ $nonce }}"
    data-post_id="{{ the_ID() }}"
    class="user_vote"
  >Vote for this post</button>
</form>
```
*php anchor*
```
  @php($link = admin_url("admin-ajax.php?action=user_vote&post_id=".get_the_ID()."&nonce=$nonce") )
  <a href="{{ $link }}" data-nonce="{{ $nonce }}" data-post_id="{{ the_ID() }}" class="user_vote">Vote for this post</a>
```

Then in our plugin or function, we catch the custom action name then delegate to a callback to verify the nonce passed in and process the request.

*The plugin which handles the ajax request*
```
class VoteForPost {
  public function __construct()
  { 
    add_action("wp_ajax_user_vote", [$this, "userVote"]);
    add_action("wp_ajax_nopriv_user_vote", [$this, "goLogin"]);
  }
  public function userVote()
  {
    if(!wp_verify_nonce($_REQUEST["nonce"], 'user_vote_nonce')) {
      exit("No vote for you...");
    }
    $post_id = $_REQUEST["post_id"];
    $vote_count = get_field("vote", $post_id) ?: 0;
    $new_vote_count = $vote_count + 1;
    $vote = update_field('vote', $new_vote_count, $post_id);
    if($vote === false) {
      $result['type'] = 'error';
      $result['votes_count'] = $vote_count;
    } else {
      $result['type'] = 'success';
      $result['votes_count'] = $new_vote_count;
    }
    if($_REQUEST["is_ajax"]) {
        $result = json_encode($result);
        echo $result;
    } else {
      header("Location: ".$_SERVER['HTTP_REFERER']);
    }
    die();
  }
  public function goLogin()
  {
    echo "You mist login to vote.";
    die();
  }
}
$VoteForPost = new VoteForPost();
```

## JS implementation
For the js implementation, its almost the same but we handle setting the path to the `wp-admin-ajax.php` using a wordpress function called localize script. Its here we can add the path in the site markup:
`localize('site_script', ['ajaxurl' => admin_url( 'admin-ajax.php' ),]`

Here is the markup used in this demo:
```
  <button data-nonce="{{ $nonce }}" data-post-id="{{ the_ID() }}" id="user_vote">Vote for this post.</button>
```

Then in the JS, we grab the data attributes and and append those values to a FormData object. We also need to pass in the custom *action* name so when the request reaches *wp-admin-ajax.php* we catch that request with the `wp_ajax_user_vote` action in our plugin:
```
const userVoteBtn = document.getElementById('user_vote'),
  voteCounter = document.getElementById('vote_counter');
  if(userVoteBtn && voteCounter) {
    userVoteBtn.addEventListener('click', function(ev) {
      ev.preventDefault()
      const ajaxUrl = site_script.ajaxurl,
      post_id = this.dataset.postId,
      nonce = this.dataset.nonce;

      let form_data = new FormData;
      form_data.append('action', 'user_vote');
      form_data.append('post_id', post_id);
      form_data.append('nonce', nonce);
      form_data.append('is_ajax', true);

      axios.post(ajaxUrl, form_data)
        .then(resp => {
          console.log({data: resp.data})
          voteCounter.innerHTML = resp.data.votes_count
        })
        .catch(err => {
          console.error();
        })

    });
  }
```
