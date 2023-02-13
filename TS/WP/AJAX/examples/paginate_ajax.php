<?php
$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
$grid_settings = array(
    'args'    => array(
        'post_type'      => 'team',
        'posts_per_page' => 3,
        'orderby'        => 'date',
        'order'          => 'ASC'
    ),
);
$the_query = sgy_get_posts($grid_settings['args']);
?>
<form>
  <div class="panel-grid">
      <div class="container">
          <div class="row">
              <div class="col-pb-10 col-pb-offset-1 col-xs-12">
                  <?php if(!empty($the_query)): ?>
                      <?php if(count($the_query['object']->posts) > 0): ?>
                          <?php if($grid_settings['filter']): ?>
                              <div class="panel-grid__filter">
                                  <?php echo $the_query['filters']; ?>
                              </div>
                          <?php endif; ?>
                          <div class="panel-grid__content">
                              <ul class="list result-wrap">
                                <?php echo $the_query['html']; ?>
                              </ul>
                          </div>
                      <?php endif; ?>
                  <?php endif; ?>
                  <nav>
                    <?php if(!empty($the_query)): ?>
                      <?php if($the_query['object']->max_num_pages > 1): ?>
                              <button
                                data-paged-val="<?= $paged ?>"
                                class="js-ajax-load-next-page button button--yellow"
                              >Next Page</button>
                          <?php endif; ?>
                    <?php endif; ?>
                   </div>
              </div>
          </div>
      </div>
  </div>
</form>

<?php
function custom_get_posts($extra_args=array()) {
  function sgy_get_posts($extra_args = []) {
    if(wp_doing_ajax()):
        $extra_args = $_POST;
    endif;
    // The tax and meta query is not in use
    // $tax_query = array();
    // $meta_query = array();
    // if(!empty($extra_args['tax'])):
    //     $tax_query['relation'] = 'AND';
    //     foreach ($extra_args['tax'] as $tax_key => $tax):
    //         if(!empty($tax) && $tax && $tax != "null"):
    //             $tax = (is_array($tax) ? $tax : array($tax));
    //             $tax_query[] = array(
    //                 'taxonomy' => $tax_key,
    //                 'field'    => 'term_id',
    //                 'terms'    => $tax,
    //             );
    //         endif;
    //     endforeach;
    //     unset($extra_args['tax']);
    // endif;
    // if(!empty($extra_args['meta'])):
    //     $meta_query['relation'] = 'AND';
    //     foreach ($extra_args['meta'] as $meta_key => $meta):
    //         if(!empty($meta) && $meta && $meta != "null"):
    //             $meta_query[] = array(
    //                 'key'       => $meta_key,
    //                 'value'     => $meta,
    //                 'compare'   => '='
    //             );
    //         endif;
    //     endforeach;
    //     unset($extra_args['meta']);
    // endif;
    $posts_per_page = get_option('posts_per_page');
    $args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'paged'          => 1,
        'posts_per_page' => $posts_per_page,
        'orderby'        => 'date',
        'order'          => 'desc',
    );
    if(!empty($extra_args)):
        $args = array_merge($args, $extra_args);
    endif;
    $query = new WP_Query($args);
    ob_start();
    if($query->have_posts()):
        while($query->have_posts()):
            $query->the_post();
            include( locate_template('templates/snippets/post-items/' . $args['post_type'] . '-grid-item.php') );
        endwhile;
        wp_reset_query();
    else:
        include( locate_template( 'templates/snippets/post-items/post-grid-item-not-found.php' ) );
    endif;
    wp_reset_postdata();
    wp_reset_query();
    $response_html = ob_get_clean();
    $response = 
        apply_filters('yk_custom_get_posts_response_' . $args['post_type'],
        [
            'object'    => $query,
            'html'      => $response_html,
            'fragments' => [],
        ]
    );
    if(wp_doing_ajax()):
        echo json_encode($response);
        die();
    else:
        return $response;
    endif;
}
add_action('wp_ajax_sgy_get_posts', 'sgy_get_posts');
add_action('wp_ajax_nopriv_sgy_get_posts', 'sgy_get_posts');

function yk_include_custom_filters($args) {
    $query          = $args['object'];
    $tax_query      = $query->tax_query;
    $post_type      = $query->query['post_type'];
    $current_page   = $query->query_vars['paged'];
    $posts_per_page = $query->query_vars['posts_per_page'];
    $queried_terms  = $tax_query->queried_terms;
    $max_pages      = intval($query->max_num_pages);
    $next_page      = 1;
    $postbacks      = isset($query->query['postbacks']) ? (int) $query->query['postbacks'] : 0;

    if($max_pages > 1 || $current_page < $max_pages):
        $next_page = $current_page + 1;
        if($postbacks === 0):
            switch($post_type):
                case 'project':
                    if($current_page === 1):
                        $next_page = $current_page + 2;
                    endif;
            endswitch;
        endif;
    endif;
    ob_start();
    include(locate_template('templates/snippets/post-filters/filter-'. $post_type .'.php'));
    $response = ob_get_clean();

    $args['filters'] = $response;
    $args['fragments']['.'. $post_type .'-filter-wrap'] = $response;
    return $args;
}

add_filter('yk_custom_get_posts_response_project', 'yk_include_custom_filters');
add_filter('yk_custom_get_posts_response_post', 'yk_include_custom_filters');
add_filter('yk_custom_get_posts_response_client', 'yk_include_custom_filters');
?>
<!-- Pagination js -->

const $resultWrap = $('ul.result-wrap'),
$loadNextPage = $('.js-ajax-load-next-page')

let pagedVal = $loadNextPage.data('pagedVal')

$loadNextPage.on('click', function(ev){
  ev.preventDefault();
  // console.log('reached load more click...!', {pagedVal})
  jQuery.ajax({
    type     : "POST",
    url      : '/wp/wp-admin/admin-ajax.php',
    dataType : "json",
    cache    : false,
    data     : {
      action: 'sgy_get_posts',
      post_type: 'team',
      paged: pagedVal + 1,
      posts_per_page: 3,
      order : 'ASC',
    },
    success  : function(data) {
      pagedVal += 1
      console.log('Reached success ajax-pagination', {pagedVal, data})
      $resultWrap.html(data.html)
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log({textStatus, errorThrown})
    }
  });
})


<!-- This is not a fully fleshed out pagination example but it holds as a good setup for making AJAX requests to retrieve sets of data. 
  We are not allowing back buttons and not checking if the last page is visitied to prevent moving forwards.
We could also allow for filtering the results as well using the yk_include_custom_filters which appends to the args array and adds paged values as well.
-->