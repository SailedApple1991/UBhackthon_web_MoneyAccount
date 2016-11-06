<template name="MAINPAGE.ACCOUNTTABLE">
    <div class="main-area">
    <h4>Current Bill</h4>
        <form class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-1 control-label" style="width: 10px;">Hi,</label>
                <div class="col-sm-10">
                    <select class="form-control" id="sel-name" style="width: 160px">
                        <%for(var i=0,item;item = nlist[i];i++){%>
                        <option name="<%=item.name%>"><%=item.name%></option>
                        <%}%>
                    </select>
                </div>
            </div>
        </form>
        <hr>
    <div id="table-data"></div>
    </div>

    <button type="button" class="btn btn-lg btn-success" style="float: right; margin-top: 20px; margin-right: 6%;"data-toggle="modal" data-target="#myModal">Add Some!</button>
    <button type="button" class="btn btn-lg btn-warning" style="float: right; margin-top: 20px; margin-right: 6%;"data-toggle="modal" data-target="#myModal1">Create New Bill!</button>

    <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">FInancial Status</h4>
                </div>
                <div class="modal-body">
                    <p>Client Name</p >
                    <input type="text" name="bookId" id="client" value=""/>
                    <p></p >
                    <p>Money spent</p >
                    <input type="text" name="bookId" id="money_spent" value=""/>
                    <p></p >
                    <p>For What</p>
        <textarea rows="4" cols="50" id="goals">
        </textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Confirm</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>

        </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="myModal1" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title"><font size="3">Type Of Bill</font></h4>
                </div>
                <div class="modal-body">
                    <p><font size="3">Name <font size="1">(Please use comma to separate each name)</font></font></p>
                    <input type="text" name="bookId" id="name" value="">
                    <p style="color: #e74c3c;">Current bill will be overwritten</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" data-action="new_bill">Confirm</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>

        </div>
    </div>

</template>
<template name="MAINPAGE.DATATABLE">
    <table class="table table-hover " style="padding: 20px;">
        <thead>
        <tr>
            <th style="text-align: center">Name</th>
            <th style="text-align: center">Event</th>
            <th style="text-align: center">Sum</th>
        </tr>
        </thead>
        <tbody>
        <%for(var i=0,item;item = DATA[i];i++){%>
        <tr>
            <td><%=item%></td>
            <td>Dining</td>
            <td><%=numList[i]%></td>
        </tr>
        <%}%>
        </tbody>
    </table>
</template>