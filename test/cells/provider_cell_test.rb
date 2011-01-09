require 'test_helper'

class ProviderCellTest < Cell::TestCase
  test "list" do
    invoke :list
    assert_select "p"
  end
  

end
